const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateOrderCreation, validateMongoId, validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { createPaymentIntent } = require('../config/stripe');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Create new order
 */
router.post('/', 
  validateOrderCreation,
  asyncHandler(async (req, res) => {
    const {
      restaurantId,
      items,
      orderType,
      deliveryAddress,
      customerNotes,
      paymentMethod
    } = req.body;

    // Verify restaurant exists and is active
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive || restaurant.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Restaurant not available'
      });
    }

    // Check if restaurant is open
    if (!restaurant.isCurrentlyOpen) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant is currently closed'
      });
    }

    // Verify menu items and calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem || !menuItem.isActive || !menuItem.isAvailableNow()) {
        return res.status(400).json({
          success: false,
          message: `Menu item "${item.menuItemId}" is not available`
        });
      }

      if (menuItem.restaurantId.toString() !== restaurantId) {
        return res.status(400).json({
          success: false,
          message: 'All items must be from the same restaurant'
        });
      }

      // Calculate item total with customizations
      let itemPrice = menuItem.discountedPrice || menuItem.price;
      let customizationCost = 0;

      if (item.customizations) {
        item.customizations.forEach(customization => {
          customizationCost += customization.additionalCost || 0;
        });
      }

      const itemSubtotal = (itemPrice + customizationCost) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: itemPrice,
        quantity: item.quantity,
        customizations: item.customizations || [],
        specialInstructions: item.specialInstructions || '',
        subtotal: itemSubtotal
      });
    }

    // Check minimum order amount
    if (subtotal < restaurant.deliveryInfo.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is $${restaurant.deliveryInfo.minimumOrder}`
      });
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    if (orderType === 'delivery') {
      deliveryFee = restaurant.deliveryInfo.deliveryFee;
      
      // Check free delivery threshold
      if (restaurant.deliveryInfo.freeDeliveryThreshold > 0 && 
          subtotal >= restaurant.deliveryInfo.freeDeliveryThreshold) {
        deliveryFee = 0;
      }

      // Verify delivery address is within range
      if (deliveryAddress && deliveryAddress.coordinates) {
        const canDeliver = restaurant.canDeliverTo(deliveryAddress.coordinates);
        if (!canDeliver) {
          return res.status(400).json({
            success: false,
            message: 'Delivery address is outside delivery range'
          });
        }
      }
    }

    // Calculate tax (8% for example)
    const taxRate = 0.08;
    const tax = Math.round((subtotal + deliveryFee) * taxRate * 100) / 100;

    // Calculate total
    const total = subtotal + deliveryFee + tax;

    // Get customer info
    const customer = await User.findById(req.user._id);

    // Create order
    const orderData = {
      customerId: req.user._id,
      restaurantId,
      items: orderItems,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      customerInfo: {
        name: `${customer.profile.firstName} ${customer.profile.lastName}`,
        phone: customer.profile.phone,
        email: customer.email
      },
      pricing: {
        subtotal,
        deliveryFee,
        serviceFee: 0, // Can be added later
        tax,
        total
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      communication: {
        customerNotes: customerNotes || ''
      }
    };

    const order = new Order(orderData);

    // Calculate estimated delivery time
    const prepTime = restaurant.deliveryInfo.estimatedDeliveryTime.max;
    const deliveryTime = orderType === 'delivery' ? 30 : 0; // 30 min delivery time
    order.calculateEstimatedDeliveryTime(prepTime, deliveryTime);

    await order.save();

    // Create payment intent for card payments
    let paymentIntent = null;
    if (paymentMethod === 'card') {
      const paymentResult = await createPaymentIntent(
        total,
        'usd',
        {
          orderId: order._id.toString(),
          customerId: req.user._id.toString(),
          restaurantId: restaurantId
        }
      );

      if (paymentResult.success) {
        order.payment.stripePaymentIntentId = paymentResult.paymentIntentId;
        await order.save();
        paymentIntent = {
          clientSecret: paymentResult.clientSecret,
          paymentIntentId: paymentResult.paymentIntentId
        };
      } else {
        // If payment intent creation fails, cancel the order
        await Order.findByIdAndDelete(order._id);
        return res.status(500).json({
          success: false,
          message: 'Failed to process payment. Please try again.'
        });
      }
    }

    // Populate order for response
    await order.populate([
      { path: 'restaurantId', select: 'name address contact deliveryInfo' },
      { path: 'items.menuItemId', select: 'name images' }
    ]);

    // Emit socket event to restaurant
    const io = req.app.get('io');
    io.to(`restaurant-${restaurantId}`).emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customerInfo.name,
      total: order.pricing.total,
      items: order.items.length
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        ...(paymentIntent && { paymentIntent })
      }
    });
  })
);

/**
 * Get user's orders
 */
router.get('/my-orders', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { customerId: req.user._id, isActive: true };
  if (status) query.status = status;

  const orders = await Order.find(query)
    .populate('restaurantId', 'name images.logo address')
    .populate('items.menuItemId', 'name images')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

/**
 * Get restaurant's orders
 */
router.get('/restaurant-orders', 
  authorize(['restaurant']),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    // Find restaurant owned by user
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const query = { restaurantId: restaurant._id, isActive: true };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customerId', 'profile.firstName profile.lastName profile.phone email')
      .populate('items.menuItemId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total,
          hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  })
);

/**
 * Get order by ID
 */
router.get('/:id', 
  validateMongoId,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name address contact images')
      .populate('customerId', 'profile.firstName profile.lastName email')
      .populate('driverId', 'profile.firstName profile.lastName profile.phone')
      .populate('items.menuItemId', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user._id.toString() === order.customerId._id.toString() ||
      req.user._id.toString() === order.driverId?.toString() ||
      req.user.role === 'admin' ||
      (req.user.role === 'restaurant' && 
       await Restaurant.findOne({ _id: order.restaurantId._id, ownerId: req.user._id }));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  })
);

/**
 * Update order status
 */
router.patch('/:id/status',
  validateMongoId,
  validate({
    status: require('joi').string().valid(
      'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'
    ).required(),
    note: require('joi').string().optional()
  }),
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions based on status and user role
    let hasPermission = false;
    
    if (req.user.role === 'admin') {
      hasPermission = true;
    } else if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ 
        _id: order.restaurantId, 
        ownerId: req.user._id 
      });
      hasPermission = restaurant && ['confirmed', 'preparing', 'ready'].includes(status);
    } else if (req.user.role === 'driver') {
      hasPermission = order.driverId?.toString() === req.user._id.toString() &&
                    ['picked_up', 'out_for_delivery', 'delivered'].includes(status);
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update order status
    await order.updateStatus(status, req.user._id, note);

    // Emit socket events
    const io = req.app.get('io');
    
    // Notify customer
    io.to(`user-${order.customerId}`).emit('order-status-update', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: status,
      timestamp: new Date()
    });

    // Notify restaurant if driver updates
    if (req.user.role === 'driver') {
      io.to(`restaurant-${order.restaurantId}`).emit('order-status-update', {
        orderId: order._id,
        status: status
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: {
          _id: order._id,
          status: order.status,
          updatedAt: order.updatedAt
        }
      }
    });
  })
);

/**
 * Cancel order
 */
router.patch('/:id/cancel',
  validateMongoId,
  validate({
    reason: require('joi').string().valid(
      'customer-request', 'restaurant-unavailable', 'payment-failed',
      'delivery-issues', 'item-unavailable', 'other'
    ).required()
  }),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Check permissions
    let hasPermission = false;
    
    if (req.user.role === 'admin') {
      hasPermission = true;
    } else if (req.user._id.toString() === order.customerId.toString()) {
      hasPermission = true;
    } else if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ 
        _id: order.restaurantId, 
        ownerId: req.user._id 
      });
      hasPermission = !!restaurant;
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cancel order
    await order.cancel(reason, req.user._id);

    // Emit socket events
    const io = req.app.get('io');
    
    // Notify all parties
    io.to(`user-${order.customerId}`).emit('order-cancelled', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      reason: reason
    });

    io.to(`restaurant-${order.restaurantId}`).emit('order-cancelled', {
      orderId: order._id,
      reason: reason
    });

    if (order.driverId) {
      io.to(`driver-${order.driverId}`).emit('order-cancelled', {
        orderId: order._id,
        reason: reason
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order: {
          _id: order._id,
          status: order.status,
          cancellation: order.cancellation
        }
      }
    });
  })
);

/**
 * Rate order
 */
router.post('/:id/rate',
  validateMongoId,
  validate({
    overall: require('joi').number().min(1).max(5).required(),
    food: require('joi').number().min(1).max(5).optional(),
    delivery: require('joi').number().min(1).max(5).optional(),
    review: require('joi').string().max(500).optional()
  }),
  asyncHandler(async (req, res) => {
    const { overall, food, delivery, review } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the customer
    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the customer can rate the order'
      });
    }

    // Check if order is completed
    if (order.status !== 'delivered' && order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order must be completed to rate'
      });
    }

    // Check if already rated
    if (order.rating.overall) {
      return res.status(400).json({
        success: false,
        message: 'Order has already been rated'
      });
    }

    // Update order rating
    order.rating = {
      overall,
      food,
      delivery,
      review,
      ratedAt: new Date()
    };
    
    order.status = 'completed';
    await order.save();

    // Update restaurant rating
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (restaurant) {
      await restaurant.updateRating(overall);
    }

    res.json({
      success: true,
      message: 'Order rated successfully',
      data: {
        rating: order.rating
      }
    });
  })
);

module.exports = router;
