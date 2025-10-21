const express = require('express');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { 
  validateRestaurantRegistration, 
  validateMongoId, 
  validateRestaurantSearchQuery,
  validate 
} = require('../middleware/validation');
const { uploadFields } = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { uploadImage } = require('../config/cloudinary');

const router = express.Router();

/**
 * Get all restaurants (with optional filters)
 */
router.get('/', 
  optionalAuth,
  validateRestaurantSearchQuery,
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search,
      cuisine,
      minRating = 0,
      maxDeliveryFee,
      maxDeliveryTime,
      latitude,
      longitude,
      radius = 10,
      sort = 'rating'
    } = req.query;

    // Build query
    const query = {
      status: 'approved',
      isActive: true
    };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Cuisine filter
    if (cuisine) {
      const cuisines = Array.isArray(cuisine) ? cuisine : [cuisine];
      query.cuisine = { $in: cuisines };
    }

    // Rating filter
    if (minRating > 0) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Delivery fee filter
    if (maxDeliveryFee) {
      query['deliveryInfo.deliveryFee'] = { $lte: parseFloat(maxDeliveryFee) };
    }

    // Delivery time filter
    if (maxDeliveryTime) {
      query['deliveryInfo.estimatedDeliveryTime.max'] = { $lte: parseInt(maxDeliveryTime) };
    }

    // Location-based search
    if (latitude && longitude) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'distance':
        // Distance sorting is handled by $near in query
        break;
      case 'deliveryTime':
        sortOptions = { 'deliveryInfo.estimatedDeliveryTime.min': 1 };
        break;
      case 'deliveryFee':
        sortOptions = { 'deliveryInfo.deliveryFee': 1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      default:
        sortOptions = { 'rating.average': -1 };
    }

    // Execute query
    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('ownerId', 'profile.firstName profile.lastName email');

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
  })
);

/**
 * Get restaurant by ID
 */
router.get('/:id', 
  validateMongoId,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('ownerId', 'profile.firstName profile.lastName email');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if restaurant is accessible
    if (restaurant.status !== 'approved' || !restaurant.isActive) {
      // Only owner and admin can access non-approved restaurants
      if (!req.user || 
          (req.user.role !== 'admin' && 
           restaurant.ownerId._id.toString() !== req.user._id.toString())) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        });
      }
    }

    res.json({
      success: true,
      data: {
        restaurant
      }
    });
  })
);

/**
 * Create new restaurant
 */
router.post('/', 
  authenticate,
  authorize(['restaurant', 'admin']),
  uploadFields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'gallery', maxCount: 5 }
  ]),
  validateRestaurantRegistration,
  asyncHandler(async (req, res) => {
    const restaurantData = {
      ...req.body,
      ownerId: req.user._id
    };

    // Handle image uploads
    if (req.files) {
      // Upload logo
      if (req.files.logo && req.files.logo[0]) {
        const logoUpload = await uploadImage(req.files.logo[0].buffer, {
          folder: 'food-delivery/restaurants/logos',
          public_id: `logo_${Date.now()}`,
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto' }
          ]
        });

        if (logoUpload.success) {
          restaurantData.images = { ...restaurantData.images, logo: logoUpload.url };
        }
      }

      // Upload banner
      if (req.files.banner && req.files.banner[0]) {
        const bannerUpload = await uploadImage(req.files.banner[0].buffer, {
          folder: 'food-delivery/restaurants/banners',
          public_id: `banner_${Date.now()}`,
          transformation: [
            { width: 1200, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        });

        if (bannerUpload.success) {
          restaurantData.images = { ...restaurantData.images, banner: bannerUpload.url };
        }
      }

      // Upload gallery images
      if (req.files.gallery && req.files.gallery.length > 0) {
        const galleryUrls = [];
        
        for (const file of req.files.gallery) {
          const galleryUpload = await uploadImage(file.buffer, {
            folder: 'food-delivery/restaurants/gallery',
            public_id: `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            transformation: [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' }
            ]
          });

          if (galleryUpload.success) {
            galleryUrls.push(galleryUpload.url);
          }
        }

        restaurantData.images = { 
          ...restaurantData.images, 
          gallery: galleryUrls 
        };
      }
    }

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully. Pending approval.',
      data: {
        restaurant
      }
    });
  })
);

/**
 * Update restaurant
 */
router.put('/:id',
  authenticate,
  validateMongoId,
  asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && 
        restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update restaurant
    const allowedUpdates = [
      'name', 'description', 'cuisine', 'contact', 'operatingHours',
      'deliveryInfo', 'features', 'paymentMethods', 'tags', 'socialMedia'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(restaurant, updates);
    await restaurant.save();

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: {
        restaurant
      }
    });
  })
);

/**
 * Get restaurant menu
 */
router.get('/:id/menu',
  validateMongoId,
  asyncHandler(async (req, res) => {
    const { category, search, sort = 'category' } = req.query;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Build query
    const query = {
      restaurantId: req.params.id,
      isActive: true,
      'availability.isAvailable': true
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'popular':
        sortOptions = { 'popularity.orderCount': -1 };
        break;
      default:
        sortOptions = { category: 1, name: 1 };
    }

    const menuItems = await MenuItem.find(query).sort(sortOptions);

    // Group by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          isOpen: restaurant.isCurrentlyOpen
        },
        menu: menuByCategory,
        totalItems: menuItems.length
      }
    });
  })
);

/**
 * Toggle restaurant status (open/closed)
 */
router.patch('/:id/toggle-status',
  authenticate,
  validateMongoId,
  asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant ${restaurant.isOpen ? 'opened' : 'closed'} successfully`,
      data: {
        isOpen: restaurant.isOpen
      }
    });
  })
);

/**
 * Get restaurant statistics (Owner/Admin only)
 */
router.get('/:id/stats',
  authenticate,
  validateMongoId,
  asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && 
        restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get basic stats
    const stats = {
      totalOrders: restaurant.totalOrders,
      totalRevenue: restaurant.totalRevenue,
      averageRating: restaurant.rating.average,
      totalReviews: restaurant.rating.totalReviews,
      menuItemsCount: await MenuItem.countDocuments({ 
        restaurantId: req.params.id, 
        isActive: true 
      })
    };

    res.json({
      success: true,
      data: {
        stats
      }
    });
  })
);

module.exports = router;
