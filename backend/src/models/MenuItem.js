const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Menu item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Menu item description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'appetizers', 'salads', 'soups', 'main-course', 'pasta', 'pizza',
      'burgers', 'sandwiches', 'seafood', 'chicken', 'beef', 'pork',
      'vegetarian', 'vegan', 'sides', 'desserts', 'beverages', 'alcohol',
      'coffee', 'tea', 'smoothies', 'breakfast', 'brunch', 'lunch',
      'dinner', 'snacks', 'specials', 'combo-meals', 'kids-menu'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    isOptional: {
      type: Boolean,
      default: false
    },
    extraCost: {
      type: Number,
      default: 0,
      min: [0, 'Extra cost cannot be negative']
    }
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      min: [0, 'Protein cannot be negative']
    },
    carbohydrates: {
      type: Number,
      min: [0, 'Carbohydrates cannot be negative']
    },
    fat: {
      type: Number,
      min: [0, 'Fat cannot be negative']
    },
    fiber: {
      type: Number,
      min: [0, 'Fiber cannot be negative']
    },
    sugar: {
      type: Number,
      min: [0, 'Sugar cannot be negative']
    },
    sodium: {
      type: Number,
      min: [0, 'Sodium cannot be negative']
    }
  },
  dietary: [{
    type: String,
    enum: [
      'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free',
      'soy-free', 'egg-free', 'shellfish-free', 'halal', 'kosher',
      'keto', 'paleo', 'low-carb', 'low-fat', 'low-sodium', 'organic'
    ]
  }],
  allergens: [{
    type: String,
    enum: [
      'milk', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts',
      'wheat', 'soybeans', 'sesame', 'mustard', 'celery', 'lupin',
      'molluscs', 'sulphites'
    ]
  }],
  spiceLevel: {
    type: String,
    enum: ['none', 'mild', 'medium', 'hot', 'extra-hot'],
    default: 'none'
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  servingSize: {
    type: String,
    required: [true, 'Serving size is required'],
    trim: true
  },
  customizations: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['single-select', 'multi-select', 'text-input'],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      price: {
        type: Number,
        default: 0,
        min: [0, 'Option price cannot be negative']
      }
    }],
    maxSelections: {
      type: Number,
      min: [1, 'Max selections must be at least 1']
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Variant price cannot be negative']
    },
    description: {
      type: String,
      trim: true
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative']
    }
  },
  popularity: {
    orderCount: {
      type: Number,
      default: 0,
      min: [0, 'Order count cannot be negative']
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative']
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableQuantity: {
      type: Number,
      min: [0, 'Available quantity cannot be negative']
    },
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    availableHours: {
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  specialOffer: {
    type: {
      type: String,
      enum: ['percentage', 'fixed-amount', 'buy-one-get-one']
    },
    value: {
      type: Number,
      min: [0, 'Special offer value cannot be negative']
    },
    validFrom: Date,
    validUntil: Date,
    description: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, isActive: 1, 'availability.isAvailable': 1 });
menuItemSchema.index({ 'rating.average': -1 });
menuItemSchema.index({ 'popularity.orderCount': -1 });
menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for discounted price
menuItemSchema.virtual('discountedPrice').get(function() {
  if (!this.specialOffer || !this.isSpecialOfferValid()) {
    return this.price;
  }
  
  switch (this.specialOffer.type) {
    case 'percentage':
      return this.price * (1 - this.specialOffer.value / 100);
    case 'fixed-amount':
      return Math.max(0, this.price - this.specialOffer.value);
    default:
      return this.price;
  }
});

// Virtual for discount percentage
menuItemSchema.virtual('discountPercentage').get(function() {
  if (!this.specialOffer || !this.isSpecialOfferValid()) {
    return 0;
  }
  
  if (this.specialOffer.type === 'percentage') {
    return this.specialOffer.value;
  } else if (this.specialOffer.type === 'fixed-amount') {
    return Math.round((this.specialOffer.value / this.price) * 100);
  }
  
  return 0;
});

// Method to check if special offer is valid
menuItemSchema.methods.isSpecialOfferValid = function() {
  if (!this.specialOffer) return false;
  
  const now = new Date();
  const validFrom = this.specialOffer.validFrom || new Date(0);
  const validUntil = this.specialOffer.validUntil || new Date('2099-12-31');
  
  return now >= validFrom && now <= validUntil;
};

// Method to check availability
menuItemSchema.methods.isAvailableNow = function() {
  if (!this.isActive || !this.availability.isAvailable) {
    return false;
  }
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  // Check if available on current day
  if (this.availability.availableDays.length > 0 && 
      !this.availability.availableDays.includes(currentDay)) {
    return false;
  }
  
  // Check if available at current time
  if (this.availability.availableHours.start && this.availability.availableHours.end) {
    return currentTime >= this.availability.availableHours.start && 
           currentTime <= this.availability.availableHours.end;
  }
  
  return true;
};

// Method to update rating
menuItemSchema.methods.updateRating = async function(newRating) {
  const currentTotal = this.rating.average * this.rating.totalReviews;
  this.rating.totalReviews += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.totalReviews;
  await this.save();
};

// Method to increment view count
menuItemSchema.methods.incrementViewCount = async function() {
  this.popularity.viewCount += 1;
  await this.save();
};

// Method to increment order count
menuItemSchema.methods.incrementOrderCount = async function(quantity = 1) {
  this.popularity.orderCount += quantity;
  await this.save();
};

// Static method to find popular items
menuItemSchema.statics.findPopular = function(restaurantId, limit = 10) {
  return this.find({
    restaurantId,
    isActive: true,
    'availability.isAvailable': true
  })
  .sort({ 'popularity.orderCount': -1 })
  .limit(limit);
};

// Static method to find featured items
menuItemSchema.statics.findFeatured = function(restaurantId) {
  return this.find({
    restaurantId,
    isActive: true,
    isFeatured: true,
    'availability.isAvailable': true
  });
};

// Static method to search menu items
menuItemSchema.statics.search = function(restaurantId, query, filters = {}) {
  const searchQuery = {
    restaurantId,
    isActive: true,
    'availability.isAvailable': true,
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery).sort({ 'rating.average': -1 });
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
