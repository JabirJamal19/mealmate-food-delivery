const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { createCustomer } = require('../config/stripe');

/**
 * Register a new user
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, role, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new ApiError('User with this email already exists', 400);
  }

  // Create user
  const userData = {
    email,
    password,
    role,
    profile,
    isEmailVerified: false,
    emailVerificationToken: crypto.randomBytes(32).toString('hex')
  };

  const user = new User(userData);
  await user.save();

  // Create Stripe customer for customers
  if (role === 'customer') {
    const stripeCustomer = await createCustomer(
      email,
      `${profile.firstName} ${profile.lastName}`,
      { userId: user._id.toString() }
    );

    if (stripeCustomer.success) {
      user.stripeCustomerId = stripeCustomer.customerId;
      await user.save();
    }
  }

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  await user.addRefreshToken(refreshToken);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toSafeObject(),
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
});

/**
 * Login user
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findByEmail(email).select('+password');
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError('Account is deactivated. Please contact support.', 401);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  await user.addRefreshToken(refreshToken);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toSafeObject(),
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
});

/**
 * Refresh access token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError('Refresh token is required', 400);
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError('Invalid refresh token', 401);
    }

    const tokenExists = user.refreshTokens.some(token => token.token === refreshToken);
    if (!tokenExists) {
      throw new ApiError('Invalid refresh token', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new ApiError('Account is deactivated', 401);
    }

    // Generate new tokens
    const newAccessToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    // Remove old refresh token and add new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Refresh token expired. Please login again.', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid refresh token', 401);
    }
    throw error;
  }
});

/**
 * Logout user
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const user = req.user;

  if (refreshToken) {
    await user.removeRefreshToken(refreshToken);
  }

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * Logout from all devices
 */
const logoutAll = asyncHandler(async (req, res) => {
  const user = req.user;

  // Clear all refresh tokens
  user.refreshTokens = [];
  await user.save();

  res.json({
    success: true,
    message: 'Logged out from all devices successfully'
  });
});

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject()
    }
  });
});

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const updates = req.body;

  // Update allowed fields
  const allowedUpdates = ['profile', 'preferences'];
  const actualUpdates = {};

  allowedUpdates.forEach(field => {
    if (updates[field]) {
      actualUpdates[field] = updates[field];
    }
  });

  Object.assign(user, actualUpdates);
  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toSafeObject()
    }
  });
});

/**
 * Change password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Clear all refresh tokens to force re-login on all devices
  user.refreshTokens = [];
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully. Please login again.'
  });
});

/**
 * Request password reset
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not
    return res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // TODO: Send email with reset link
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  // await sendPasswordResetEmail(user.email, resetUrl);

  res.json({
    success: true,
    message: 'Password reset link sent to your email',
    // Remove in production
    ...(process.env.NODE_ENV === 'development' && { resetToken })
  });
});

/**
 * Reset password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError('Invalid or expired reset token', 400);
  }

  // Update password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  // Clear all refresh tokens
  user.refreshTokens = [];
  
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful. Please login with your new password.'
  });
});

/**
 * Verify email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    throw new ApiError('Invalid verification token', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

/**
 * Resend email verification
 */
const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.isEmailVerified) {
    throw new ApiError('Email is already verified', 400);
  }

  // Generate new verification token
  user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  await user.save();

  // TODO: Send verification email
  // const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${user.emailVerificationToken}`;
  // await sendEmailVerification(user.email, verificationUrl);

  res.json({
    success: true,
    message: 'Verification email sent',
    // Remove in production
    ...(process.env.NODE_ENV === 'development' && { 
      verificationToken: user.emailVerificationToken 
    })
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendEmailVerification
};
