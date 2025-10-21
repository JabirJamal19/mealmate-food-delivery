const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'food-delivery-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle different types of errors and convert them to ApiError
 */
const handleError = (error) => {
  let convertedError = error;

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    convertedError = new ApiError(message, 400);
  }

  // MongoDB validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    const message = `Validation Error: ${errors.join(', ')}`;
    convertedError = new ApiError(message, 400);
  }

  // MongoDB cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    const message = `Invalid ${error.path}: ${error.value}`;
    convertedError = new ApiError(message, 400);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    convertedError = new ApiError('Invalid token', 401);
  }

  if (error.name === 'TokenExpiredError') {
    convertedError = new ApiError('Token expired', 401);
  }

  // Multer errors (file upload)
  if (error.code === 'LIMIT_FILE_SIZE') {
    convertedError = new ApiError('File size too large', 400);
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    convertedError = new ApiError('Unexpected file field', 400);
  }

  // Stripe errors
  if (error.type && error.type.startsWith('Stripe')) {
    convertedError = new ApiError(`Payment error: ${error.message}`, 400);
  }

  return convertedError;
};

/**
 * Send error response to client
 */
const sendErrorResponse = (error, req, res) => {
  const { statusCode = 500, message } = error;
  
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      error: error 
    })
  };

  // Add request ID if available
  if (req.requestId) {
    response.requestId = req.requestId;
  }

  res.status(statusCode).json(response);
};

/**
 * Main error handling middleware
 */
const errorHandler = (error, req, res, next) => {
  // Convert error to ApiError if it's not already
  const convertedError = error instanceof ApiError ? error : handleError(error);

  // Log error
  const logLevel = convertedError.statusCode >= 500 ? 'error' : 'warn';
  logger.log(logLevel, {
    message: convertedError.message,
    statusCode: convertedError.statusCode,
    stack: convertedError.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    requestId: req.requestId
  });

  // Send error response
  sendErrorResponse(convertedError, req, res);
};

/**
 * Handle 404 errors
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async error wrapper to catch async errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request ID middleware for tracking requests
 */
const requestId = (req, res, next) => {
  req.requestId = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
  res.set('X-Request-ID', req.requestId);
  next();
};

/**
 * Rate limiting error handler
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests, please try again later',
    retryAfter: Math.round(req.rateLimit.resetTime / 1000) || 1
  });
};

/**
 * Validation error formatter
 */
const formatValidationError = (errors) => {
  return errors.map(error => ({
    field: error.path,
    message: error.message,
    value: error.value
  }));
};

/**
 * Database connection error handler
 */
const handleDatabaseError = (error) => {
  logger.error('Database connection error:', error);
  
  if (error.name === 'MongoNetworkError') {
    return new ApiError('Database connection failed', 503);
  }
  
  if (error.name === 'MongoTimeoutError') {
    return new ApiError('Database operation timed out', 503);
  }
  
  return new ApiError('Database error occurred', 500);
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = (server) => {
  return (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close((err) => {
      if (err) {
        logger.error('Error during server shutdown:', err);
        process.exit(1);
      }
      
      logger.info('Server closed successfully');
      process.exit(0);
    });
    
    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  };
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  requestId,
  rateLimitHandler,
  formatValidationError,
  handleDatabaseError,
  gracefulShutdown,
  logger
};
