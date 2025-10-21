const Joi = require('joi');

/**
 * Generic validation middleware
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User validation schemas
  userRegistration: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      }),
    role: Joi.string()
      .valid('customer', 'restaurant', 'driver')
      .default('customer'),
    profile: Joi.object({
      firstName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
          'string.min': 'First name is required',
          'string.max': 'First name cannot exceed 50 characters',
          'any.required': 'First name is required'
        }),
      lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
          'string.min': 'Last name is required',
          'string.max': 'Last name cannot exceed 50 characters',
          'any.required': 'Last name is required'
        }),
      phone: Joi.string()
        .pattern(/^\+?[\d\s-()]+$/)
        .messages({
          'string.pattern.base': 'Please provide a valid phone number'
        }),
      dateOfBirth: Joi.date()
        .max('now')
        .messages({
          'date.max': 'Date of birth cannot be in the future'
        })
    }).required()
  }),

  userLogin: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  userProfileUpdate: Joi.object({
    profile: Joi.object({
      firstName: Joi.string().trim().min(1).max(50),
      lastName: Joi.string().trim().min(1).max(50),
      phone: Joi.string().pattern(/^\+?[\d\s-()]+$/),
      dateOfBirth: Joi.date().max('now')
    }),
    preferences: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean(),
        sms: Joi.boolean(),
        push: Joi.boolean()
      }),
      dietary: Joi.array().items(
        Joi.string().valid('vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher')
      ),
      cuisinePreferences: Joi.array().items(Joi.string())
    })
  }),

  // Address validation schema
  address: Joi.object({
    type: Joi.string().valid('home', 'work', 'other').default('home'),
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim(),
    zipCode: Joi.string().trim(),
    country: Joi.string().trim().default('United States'),
    coordinates: Joi.array().items(Joi.number()).length(2),
    isDefault: Joi.boolean().default(false)
  }),

  // Restaurant validation schemas
  restaurantRegistration: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required(),
    description: Joi.string()
      .trim()
      .min(10)
      .max(500)
      .required(),
    cuisine: Joi.array()
      .items(Joi.string().valid(
        'american', 'italian', 'chinese', 'indian', 'mexican', 'japanese',
        'thai', 'mediterranean', 'french', 'korean', 'vietnamese', 'greek',
        'spanish', 'turkish', 'lebanese', 'moroccan', 'ethiopian', 'brazilian',
        'peruvian', 'german', 'british', 'russian', 'caribbean', 'african',
        'fusion', 'vegetarian', 'vegan', 'healthy', 'fast-food', 'pizza',
        'burgers', 'sandwiches', 'salads', 'seafood', 'steakhouse', 'bbq',
        'desserts', 'bakery', 'coffee', 'breakfast', 'brunch'
      ))
      .min(1)
      .required(),
    address: Joi.object({
      street: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      zipCode: Joi.string().trim().required(),
      country: Joi.string().trim().default('United States'),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required(),
    contact: Joi.object({
      phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).required(),
      email: Joi.string().email().required(),
      website: Joi.string().uri()
    }).required(),
    deliveryInfo: Joi.object({
      deliveryRadius: Joi.number().min(1).max(50).required(),
      minimumOrder: Joi.number().min(0).required(),
      deliveryFee: Joi.number().min(0).required(),
      freeDeliveryThreshold: Joi.number().min(0).default(0),
      estimatedDeliveryTime: Joi.object({
        min: Joi.number().min(10).required(),
        max: Joi.number().min(15).required()
      }).required()
    }).required(),
    businessInfo: Joi.object({
      licenseNumber: Joi.string().required(),
      taxId: Joi.string().required(),
      establishedYear: Joi.number().min(1900).max(new Date().getFullYear())
    }).required()
  }),

  // Menu item validation schema
  menuItem: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().trim().min(10).max(500).required(),
    category: Joi.string().valid(
      'appetizers', 'salads', 'soups', 'main-course', 'pasta', 'pizza',
      'burgers', 'sandwiches', 'seafood', 'chicken', 'beef', 'pork',
      'vegetarian', 'vegan', 'sides', 'desserts', 'beverages', 'alcohol',
      'coffee', 'tea', 'smoothies', 'breakfast', 'brunch', 'lunch',
      'dinner', 'snacks', 'specials', 'combo-meals', 'kids-menu'
    ).required(),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0),
    preparationTime: Joi.number().min(1).max(120).required(),
    servingSize: Joi.string().trim().required(),
    dietary: Joi.array().items(
      Joi.string().valid(
        'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free',
        'soy-free', 'egg-free', 'shellfish-free', 'halal', 'kosher',
        'keto', 'paleo', 'low-carb', 'low-fat', 'low-sodium', 'organic'
      )
    ),
    allergens: Joi.array().items(
      Joi.string().valid(
        'milk', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts',
        'wheat', 'soybeans', 'sesame', 'mustard', 'celery', 'lupin',
        'molluscs', 'sulphites'
      )
    ),
    spiceLevel: Joi.string().valid('none', 'mild', 'medium', 'hot', 'extra-hot').default('none')
  }),

  // Order validation schema
  orderCreation: Joi.object({
    restaurantId: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        menuItemId: Joi.string().required(),
        quantity: Joi.number().min(1).max(10).required(),
        customizations: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            selectedOptions: Joi.array().items(Joi.string()),
            additionalCost: Joi.number().min(0).default(0)
          })
        ),
        specialInstructions: Joi.string().max(200)
      })
    ).min(1).required(),
    orderType: Joi.string().valid('delivery', 'pickup').default('delivery'),
    deliveryAddress: Joi.when('orderType', {
      is: 'delivery',
      then: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
        deliveryInstructions: Joi.string().max(300)
      }).required(),
      otherwise: Joi.optional()
    }),
    customerNotes: Joi.string().max(500),
    paymentMethod: Joi.string().valid('card', 'cash', 'digital-wallet').required()
  }),

  // Query parameter validation schemas
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('-createdAt'),
    search: Joi.string().trim()
  }),

  restaurantSearchQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    search: Joi.string().trim(),
    cuisine: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    minRating: Joi.number().min(0).max(5),
    maxDeliveryFee: Joi.number().min(0),
    maxDeliveryTime: Joi.number().min(0),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    radius: Joi.number().min(1).max(50).default(10),
    sort: Joi.string().valid('rating', 'distance', 'deliveryTime', 'deliveryFee', 'name').default('rating')
  }),

  // ID parameter validation
  mongoId: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid ID format'
    })
  })
};

// Validation middleware functions
const validateUserRegistration = validate(schemas.userRegistration);
const validateUserLogin = validate(schemas.userLogin);
const validateUserProfileUpdate = validate(schemas.userProfileUpdate);
const validateAddress = validate(schemas.address);
const validateRestaurantRegistration = validate(schemas.restaurantRegistration);
const validateMenuItem = validate(schemas.menuItem);
const validateOrderCreation = validate(schemas.orderCreation);
const validatePaginationQuery = validate(schemas.paginationQuery, 'query');
const validateRestaurantSearchQuery = validate(schemas.restaurantSearchQuery, 'query');
const validateMongoId = validate(schemas.mongoId, 'params');

module.exports = {
  validate,
  schemas,
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  validateAddress,
  validateRestaurantRegistration,
  validateMenuItem,
  validateOrderCreation,
  validatePaginationQuery,
  validateRestaurantSearchQuery,
  validateMongoId
};
