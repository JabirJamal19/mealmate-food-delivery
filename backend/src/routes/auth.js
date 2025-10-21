const express = require('express');
const rateLimit = require('express-rate-limit');
const {
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
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  validate,
  schemas
} = require('../middleware/validation');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Validation schemas for auth routes
const refreshTokenSchema = validate(
  schemas.refreshToken || {
    refreshToken: require('joi').string().required()
  }
);

const changePasswordSchema = validate({
  currentPassword: require('joi').string().required(),
  newPassword: require('joi').string().min(6).max(128).required()
});

const requestPasswordResetSchema = validate({
  email: require('joi').string().email().required()
});

const resetPasswordSchema = validate({
  password: require('joi').string().min(6).max(128).required()
});

// Public routes
router.post('/register', authLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);
router.post('/refresh-token', generalLimiter, refreshTokenSchema, refreshToken);
router.post('/request-password-reset', authLimiter, requestPasswordResetSchema, requestPasswordReset);
router.post('/reset-password/:token', authLimiter, resetPasswordSchema, resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.get('/profile', getProfile);
router.put('/profile', validateUserProfileUpdate, updateProfile);
router.post('/change-password', changePasswordSchema, changePassword);
router.post('/resend-verification', resendEmailVerification);

module.exports = router;
