const express = require('express');
const { authenticate, authorize, checkOwnership } = require('../middleware/auth');
const { validateAddress, validateMongoId } = require('../middleware/validation');
const { uploadSingle } = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Get user addresses
 */
router.get('/addresses', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  res.json({
    success: true,
    data: {
      addresses: user.addresses
    }
  });
}));

/**
 * Add new address
 */
router.post('/addresses', validateAddress, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressData = req.body;

  // If this is set as default, unset other default addresses
  if (addressData.isDefault) {
    user.addresses.forEach(address => {
      address.isDefault = false;
    });
  }

  // If this is the first address, make it default
  if (user.addresses.length === 0) {
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: {
      address: user.addresses[user.addresses.length - 1]
    }
  });
}));

/**
 * Update address
 */
router.put('/addresses/:addressId', validateAddress, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { addressId } = req.params;
  const updateData = req.body;

  const address = user.addresses.id(addressId);
  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  // If setting as default, unset other default addresses
  if (updateData.isDefault) {
    user.addresses.forEach(addr => {
      if (addr._id.toString() !== addressId) {
        addr.isDefault = false;
      }
    });
  }

  Object.assign(address, updateData);
  await user.save();

  res.json({
    success: true,
    message: 'Address updated successfully',
    data: {
      address
    }
  });
}));

/**
 * Delete address
 */
router.delete('/addresses/:addressId', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { addressId } = req.params;

  const address = user.addresses.id(addressId);
  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  const wasDefault = address.isDefault;
  address.remove();

  // If deleted address was default, make first remaining address default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Address deleted successfully'
  });
}));

/**
 * Upload avatar
 */
router.post('/avatar', uploadSingle('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Upload to Cloudinary
  const uploadResult = await uploadImage(req.file.buffer, {
    folder: 'food-delivery/avatars',
    public_id: `avatar_${req.user._id}_${Date.now()}`,
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ]
  });

  if (!uploadResult.success) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }

  // Update user avatar
  const user = await User.findById(req.user._id);
  user.profile.avatar = uploadResult.url;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      avatarUrl: uploadResult.url
    }
  });
}));

/**
 * Get user by ID (Admin only)
 */
router.get('/:id', 
  authorize(['admin']), 
  validateMongoId, 
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toSafeObject()
      }
    });
  })
);

/**
 * Update user status (Admin only)
 */
router.patch('/:id/status', 
  authorize(['admin']), 
  validateMongoId, 
  asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

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
 * Get all users (Admin only)
 */
router.get('/', 
  authorize(['admin']), 
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
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

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      select: '-password -refreshTokens -emailVerificationToken -passwordResetToken'
    };

    const users = await User.paginate(query, options);

    res.json({
      success: true,
      data: {
        users: users.docs,
        pagination: {
          currentPage: users.page,
          totalPages: users.totalPages,
          totalUsers: users.totalDocs,
          hasNextPage: users.hasNextPage,
          hasPrevPage: users.hasPrevPage
        }
      }
    });
  })
);

/**
 * Delete user (Admin only)
 */
router.delete('/:id', 
  authorize(['admin']), 
  validateMongoId, 
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

module.exports = router;
