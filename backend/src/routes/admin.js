const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, validateMongoId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(['admin']));

/**
 * Get dashboard statistics
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  
  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Get basic counts
  const [
    totalUsers,
    totalRestaurants,
    totalOrders,
    activeUsers,
    pendingRestaurants,
    recentOrders
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Restaurant.countDocuments({ isActive: true }),
    Order.countDocuments({ isActive: true }),
    User.countDocuments({ 
      isActive: true, 
      lastLogin: { $gte: startDate } 
    }),
    Restaurant.countDocuments({ status: 'pending' }),
    Order.countDocuments({ 
      createdAt: { $gte: startDate },
      isActive: true 
    })
  ]);

  // Get revenue statistics
  const revenueStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'completed'] },
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  // Get order status distribution
  const orderStatusStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get top restaurants by orders
  const topRestaurants = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: '$restaurantId',
        orderCount: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' }
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: '_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $project: {
        name: '$restaurant.name',
        orderCount: 1,
        totalRevenue: 1
      }
    },
    {
      $sort: { orderCount: -1 }
    },
    {
      $limit: 5
    }
  ]);

  // Get daily order trends
  const dailyTrends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$pricing.total' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  const stats = {
    overview: {
      totalUsers,
      totalRestaurants,
      totalOrders,
      activeUsers,
      pendingRestaurants,
      recentOrders
    },
    revenue: revenueStats[0] || {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalOrders: 0
    },
    orderStatus: orderStatusStats,
    topRestaurants,
    dailyTrends
  };

  res.json({
    success: true,
    data: {
      stats,
      period
    }
  });
}));

/**
 * Get all users with filters
 */
router.get('/users', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    role,
    isActive,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build query
  const query = {};
  
  if (role) query.role = role;
  if (typeof isActive !== 'undefined') query.isActive = isActive === 'true';
  
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { 'profile.firstName': { $regex: search, $options: 'i' } },
      { 'profile.lastName': { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query
  const users = await User.find(query)
    .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

/**
 * Get all restaurants with filters
 */
router.get('/restaurants', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    isActive,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build query
  const query = {};
  
  if (status) query.status = status;
  if (typeof isActive !== 'undefined') query.isActive = isActive === 'true';
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'contact.email': { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query
  const restaurants = await Restaurant.find(query)
    .populate('ownerId', 'profile.firstName profile.lastName email')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Restaurant.countDocuments(query);

  res.json({
    success: true,
    data: {
      restaurants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRestaurants: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

/**
 * Approve/Reject restaurant
 */
router.patch('/restaurants/:id/status',
  validateMongoId,
  validate({
    status: require('joi').string().valid('approved', 'rejected').required(),
    note: require('joi').string().optional()
  }),
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    restaurant.status = status;
    await restaurant.save();

    // TODO: Send notification email to restaurant owner
    
    res.json({
      success: true,
      message: `Restaurant ${status} successfully`,
      data: {
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          status: restaurant.status
        }
      }
    });
  })
);

/**
 * Get all orders with filters
 */
router.get('/orders', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    search,
    startDate,
    endDate,
    sort = '-createdAt'
  } = req.query;

  // Build query
  const query = { isActive: true };
  
  if (status) query.status = status;
  if (paymentStatus) query['payment.status'] = paymentStatus;
  
  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customerInfo.name': { $regex: search, $options: 'i' } },
      { 'customerInfo.email': { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query
  const orders = await Order.find(query)
    .populate('customerId', 'profile.firstName profile.lastName email')
    .populate('restaurantId', 'name')
    .populate('driverId', 'profile.firstName profile.lastName')
    .sort(sort)
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
 * Get analytics data
 */
router.get('/analytics', asyncHandler(async (req, res) => {
  const { type = 'revenue', period = '30d' } = req.query;
  
  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  let analyticsData;

  switch (type) {
    case 'revenue':
      analyticsData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['delivered', 'completed'] },
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === '1y' ? '%Y-%m' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            revenue: { $sum: '$pricing.total' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);
      break;

    case 'users':
      analyticsData = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === '1y' ? '%Y-%m' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            newUsers: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);
      break;

    case 'restaurants':
      analyticsData = await Restaurant.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === '1y' ? '%Y-%m' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            newRestaurants: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid analytics type'
      });
  }

  res.json({
    success: true,
    data: {
      analytics: analyticsData,
      type,
      period
    }
  });
}));

/**
 * Update user status
 */
router.patch('/users/:id/status',
  validateMongoId,
  validate({
    isActive: require('joi').boolean().required()
  }),
  asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: user.toSafeObject()
      }
    });
  })
);

/**
 * Delete user (soft delete)
 */
router.delete('/users/:id',
  validateMongoId,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

/**
 * Get system settings (placeholder for future implementation)
 */
router.get('/settings', asyncHandler(async (req, res) => {
  const settings = {
    platform: {
      name: 'Food Delivery App',
      version: '1.0.0',
      maintenanceMode: false
    },
    payments: {
      stripeEnabled: true,
      cashOnDeliveryEnabled: true
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true
    }
  };

  res.json({
    success: true,
    data: {
      settings
    }
  });
}));

module.exports = router;
