const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create payment intent
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (default: 'usd')
 * @param {object} metadata - Additional metadata
 * @returns {Promise} - Stripe payment intent
 */
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Confirm payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise} - Confirmation result
 */
const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent
    };
  } catch (error) {
    console.error('Stripe confirm payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create customer
 * @param {string} email - Customer email
 * @param {string} name - Customer name
 * @param {object} metadata - Additional metadata
 * @returns {Promise} - Stripe customer
 */
const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });

    return {
      success: true,
      customerId: customer.id,
      customer
    };
  } catch (error) {
    console.error('Stripe create customer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create refund
 * @param {string} paymentIntentId - Payment intent ID
 * @param {number} amount - Refund amount in cents (optional)
 * @param {string} reason - Refund reason
 * @returns {Promise} - Refund result
 */
const createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    const refundData = {
      payment_intent: paymentIntentId,
      reason
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
      refund
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify webhook signature
 * @param {string} payload - Request body
 * @param {string} signature - Stripe signature header
 * @returns {object} - Verified event or error
 */
const verifyWebhookSignature = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    return {
      success: true,
      event
    };
  } catch (error) {
    console.error('Stripe webhook verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  stripe,
  createPaymentIntent,
  confirmPaymentIntent,
  createCustomer,
  createRefund,
  verifyWebhookSignature
};
