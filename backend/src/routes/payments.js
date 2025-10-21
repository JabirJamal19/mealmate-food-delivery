const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const Order = require('../models/Order');
const { 
  confirmPaymentIntent, 
  createRefund, 
  verifyWebhookSignature 
} = require('../config/stripe');

const router = express.Router();

/**
 * Confirm payment
 */
router.post('/confirm',
  authenticate,
  validate({
    paymentIntentId: require('joi').string().required(),
    orderId: require('joi').string().required()
  }),
  asyncHandler(async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Confirm payment with Stripe
    const paymentResult = await confirmPaymentIntent(paymentIntentId);
    
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment confirmation failed',
        error: paymentResult.error
      });
    }

    // Update order payment status
    if (paymentResult.status === 'succeeded') {
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.payment.transactionId = paymentIntentId;
      
      // Update order status to confirmed
      await order.updateStatus('confirmed', null, 'Payment confirmed');
      
      // Emit socket event to restaurant
      const io = req.app.get('io');
      io.to(`restaurant-${order.restaurantId}`).emit('payment-confirmed', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: order.pricing.total
      });
    } else {
      order.payment.status = 'failed';
      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        paymentStatus: order.payment.status,
        orderStatus: order.status
      }
    });
  })
);

/**
 * Request refund
 */
router.post('/refund',
  authenticate,
  validate({
    orderId: require('joi').string().required(),
    reason: require('joi').string().required(),
    amount: require('joi').number().positive().optional()
  }),
  asyncHandler(async (req, res) => {
    const { orderId, reason, amount } = req.body;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions (customer or admin)
    if (order.customerId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if payment was completed
    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund unpaid order'
      });
    }

    // Check if already refunded
    if (order.payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been refunded'
      });
    }

    // Process refund with Stripe
    const refundAmount = amount || order.pricing.total;
    const refundResult = await createRefund(
      order.payment.stripePaymentIntentId,
      refundAmount,
      'requested_by_customer'
    );

    if (!refundResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Refund processing failed',
        error: refundResult.error
      });
    }

    // Update order
    order.payment.status = 'refunded';
    order.payment.refundedAt = new Date();
    order.payment.refundAmount = refundAmount;
    order.status = 'refunded';
    
    // Add to status history
    order.tracking.statusHistory.push({
      status: 'refunded',
      timestamp: new Date(),
      note: `Refund processed: $${refundAmount}. Reason: ${reason}`,
      updatedBy: req.user._id
    });

    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refundResult.refundId,
        refundAmount: refundAmount,
        status: refundResult.status
      }
    });
  })
);

/**
 * Get payment history
 */
router.get('/history',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { 
      customerId: req.user._id,
      'payment.status': { $in: ['completed', 'refunded'] }
    };

    if (status) {
      query['payment.status'] = status;
    }

    const payments = await Order.find(query)
      .select('orderNumber payment pricing restaurantId createdAt')
      .populate('restaurantId', 'name')
      .sort({ 'payment.paidAt': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalPayments: total,
          hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  })
);

/**
 * Stripe webhook handler
 */
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];
    
    // Verify webhook signature
    const webhookResult = verifyWebhookSignature(req.body, signature);
    
    if (!webhookResult.success) {
      console.error('Webhook signature verification failed:', webhookResult.error);
      return res.status(400).send('Webhook signature verification failed');
    }

    const event = webhookResult.event;

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSucceeded(event.data.object);
          break;
          
        case 'payment_intent.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;
          
        case 'charge.dispute.created':
          await handleChargeDispute(event.data.object);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).send('Webhook handler failed');
    }
  })
);

/**
 * Handle successful payment
 */
const handlePaymentSucceeded = async (paymentIntent) => {
  const orderId = paymentIntent.metadata.orderId;
  
  if (!orderId) {
    console.error('No orderId in payment intent metadata');
    return;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    console.error(`Order not found: ${orderId}`);
    return;
  }

  // Update payment status
  order.payment.status = 'completed';
  order.payment.paidAt = new Date();
  order.payment.transactionId = paymentIntent.id;
  
  // Update order status if still pending
  if (order.status === 'pending') {
    await order.updateStatus('confirmed', null, 'Payment confirmed via webhook');
  } else {
    await order.save();
  }

  console.log(`Payment succeeded for order: ${order.orderNumber}`);
};

/**
 * Handle failed payment
 */
const handlePaymentFailed = async (paymentIntent) => {
  const orderId = paymentIntent.metadata.orderId;
  
  if (!orderId) {
    console.error('No orderId in payment intent metadata');
    return;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    console.error(`Order not found: ${orderId}`);
    return;
  }

  // Update payment status
  order.payment.status = 'failed';
  
  // Cancel order if payment failed
  await order.cancel('payment-failed', null);

  console.log(`Payment failed for order: ${order.orderNumber}`);
};

/**
 * Handle charge dispute
 */
const handleChargeDispute = async (dispute) => {
  const chargeId = dispute.charge;
  
  // Find order by transaction ID
  const order = await Order.findOne({ 'payment.transactionId': chargeId });
  
  if (!order) {
    console.error(`Order not found for charge: ${chargeId}`);
    return;
  }

  // Add note to order
  order.tracking.statusHistory.push({
    status: order.status,
    timestamp: new Date(),
    note: `Charge dispute created. Dispute ID: ${dispute.id}. Reason: ${dispute.reason}`
  });

  await order.save();

  console.log(`Charge dispute created for order: ${order.orderNumber}`);
};

/**
 * Get payment methods (for future implementation)
 */
router.get('/methods',
  authenticate,
  asyncHandler(async (req, res) => {
    // This would integrate with Stripe to get saved payment methods
    // For now, return empty array
    res.json({
      success: true,
      data: {
        paymentMethods: []
      }
    });
  })
);

/**
 * Add payment method (for future implementation)
 */
router.post('/methods',
  authenticate,
  validate({
    paymentMethodId: require('joi').string().required()
  }),
  asyncHandler(async (req, res) => {
    // This would integrate with Stripe to save payment methods
    res.json({
      success: true,
      message: 'Payment method saved successfully'
    });
  })
);

module.exports = router;
