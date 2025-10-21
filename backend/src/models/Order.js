const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    customizations: [{
      name: String,
      selectedOptions: [String],
      additionalCost: {
        type: Number,
        default: 0,
        min: [0, 'Additional cost cannot be negative']
      }
    }],
    specialInstructions: {
      type: String,
      maxlength: [200, 'Special instructions cannot exceed 200 characters']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    }
  }],
  orderType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  status: {
    type: String,
    enum: [
      'pending',           // Order placed, waiting for restaurant confirmation
      'confirmed',         // Restaurant confirmed the order
      'preparing',         // Restaurant is preparing the order
      'ready',            // Order is ready for pickup/delivery
      'picked_up',        // Driver picked up the order
      'out_for_delivery', // Order is out for delivery
      'delivered',        // Order has been delivered
      'completed',        // Order completed successfully
      'cancelled',        // Order was cancelled
      'refunded'          // Order was refunded
    ],
    default: 'pending'
  },
  deliveryAddress: {
    street: {
      type: String,
      required: function() { return this.orderType === 'delivery'; }
    },
    city: {
      type: String,
      required: function() { return this.orderType === 'delivery'; }
    },
    state: {
      type: String,
      required: function() { return this.orderType === 'delivery'; }
    },
    zipCode: {
      type: String,
      required: function() { return this.orderType === 'delivery'; }
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: function() { return this.orderType === 'delivery'; }
    },
    deliveryInstructions: {
      type: String,
      maxlength: [300, 'Delivery instructions cannot exceed 300 characters']
    }
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, 'Delivery fee cannot be negative']
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: [0, 'Service fee cannot be negative']
    },
    tax: {
      type: Number,
      required: true,
      min: [0, 'Tax cannot be negative']
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
        min: [0, 'Discount amount cannot be negative']
      },
      code: String,
      description: String
    },
    tip: {
      type: Number,
      default: 0,
      min: [0, 'Tip cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'cash', 'digital-wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    }
  },
  timing: {
    placedAt: {
      type: Date,
      default: Date.now
    },
    confirmedAt: Date,
    preparationStartedAt: Date,
    readyAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    preparationTime: {
      type: Number, // in minutes
      min: [0, 'Preparation time cannot be negative']
    }
  },
  tracking: {
    driverLocation: {
      coordinates: [Number], // [longitude, latitude]
      lastUpdated: Date
    },
    statusHistory: [{
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  communication: {
    customerNotes: {
      type: String,
      maxlength: [500, 'Customer notes cannot exceed 500 characters']
    },
    restaurantNotes: {
      type: String,
      maxlength: [500, 'Restaurant notes cannot exceed 500 characters']
    },
    driverNotes: {
      type: String,
      maxlength: [500, 'Driver notes cannot exceed 500 characters']
    }
  },
  rating: {
    overall: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    food: {
      type: Number,
      min: [1, 'Food rating must be at least 1'],
      max: [5, 'Food rating cannot exceed 5']
    },
    delivery: {
      type: Number,
      min: [1, 'Delivery rating must be at least 1'],
      max: [5, 'Delivery rating cannot exceed 5']
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  cancellation: {
    reason: {
      type: String,
      enum: [
        'customer-request', 'restaurant-unavailable', 'payment-failed',
        'delivery-issues', 'item-unavailable', 'other'
      ]
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundProcessed: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ driverId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'timing.placedAt': -1 });

// Virtual for full delivery address
orderSchema.virtual('fullDeliveryAddress').get(function() {
  if (this.orderType !== 'delivery' || !this.deliveryAddress) return null;
  
  return `${this.deliveryAddress.street}, ${this.deliveryAddress.city}, ${this.deliveryAddress.state} ${this.deliveryAddress.zipCode}`;
});

// Virtual for order duration
orderSchema.virtual('orderDuration').get(function() {
  if (!this.timing.deliveredAt) return null;
  
  const start = this.timing.placedAt;
  const end = this.timing.deliveredAt;
  return Math.round((end - start) / (1000 * 60)); // Duration in minutes
});

// Virtual for delivery delay
orderSchema.virtual('deliveryDelay').get(function() {
  if (!this.timing.estimatedDeliveryTime || !this.timing.actualDeliveryTime) return null;
  
  const estimated = this.timing.estimatedDeliveryTime;
  const actual = this.timing.actualDeliveryTime;
  return Math.round((actual - estimated) / (1000 * 60)); // Delay in minutes
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const lastOrder = await this.constructor.findOne({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.tracking.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = async function(newStatus, updatedBy = null, note = '') {
  this.status = newStatus;
  
  // Update timing based on status
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.timing.confirmedAt = now;
      break;
    case 'preparing':
      this.timing.preparationStartedAt = now;
      break;
    case 'ready':
      this.timing.readyAt = now;
      break;
    case 'picked_up':
      this.timing.pickedUpAt = now;
      break;
    case 'delivered':
      this.timing.deliveredAt = now;
      this.timing.actualDeliveryTime = now;
      break;
  }
  
  // Add to status history
  this.tracking.statusHistory.push({
    status: newStatus,
    timestamp: now,
    note,
    updatedBy
  });
  
  await this.save();
};

// Method to calculate estimated delivery time
orderSchema.methods.calculateEstimatedDeliveryTime = function(restaurantPrepTime, deliveryTime = 30) {
  const now = new Date();
  const totalMinutes = (this.timing.preparationTime || restaurantPrepTime) + deliveryTime;
  this.timing.estimatedDeliveryTime = new Date(now.getTime() + totalMinutes * 60000);
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const cancellableStatuses = ['pending', 'confirmed', 'preparing'];
  return cancellableStatuses.includes(this.status);
};

// Method to cancel order
orderSchema.methods.cancel = async function(reason, cancelledBy) {
  if (!this.canBeCancelled()) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  this.status = 'cancelled';
  this.cancellation = {
    reason,
    cancelledBy,
    cancelledAt: new Date()
  };
  
  await this.save();
};

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function(customerId, status = null) {
  const query = { customerId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find orders by restaurant
orderSchema.statics.findByRestaurant = function(restaurantId, status = null) {
  const query = { restaurantId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find orders by driver
orderSchema.statics.findByDriver = function(driverId, status = null) {
  const query = { driverId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get order statistics
orderSchema.statics.getStatistics = async function(filters = {}) {
  const pipeline = [
    { $match: { isActive: true, ...filters } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };
};

module.exports = mongoose.model('Order', orderSchema);
