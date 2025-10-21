const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cuisine: [{
    type: String,
    required: true,
    enum: [
      'american', 'italian', 'chinese', 'indian', 'mexican', 'japanese',
      'thai', 'mediterranean', 'french', 'korean', 'vietnamese', 'greek',
      'spanish', 'turkish', 'lebanese', 'moroccan', 'ethiopian', 'brazilian',
      'peruvian', 'german', 'british', 'russian', 'caribbean', 'african',
      'fusion', 'vegetarian', 'vegan', 'healthy', 'fast-food', 'pizza',
      'burgers', 'sandwiches', 'salads', 'seafood', 'steakhouse', 'bbq',
      'desserts', 'bakery', 'coffee', 'breakfast', 'brunch'
    ]
  }],
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'United States',
      trim: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    }
  },
  operatingHours: [{
    day: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    open: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    },
    close: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    },
    isClosed: {
      type: Boolean,
      default: false
    }
  }],
  deliveryInfo: {
    deliveryRadius: {
      type: Number,
      required: [true, 'Delivery radius is required'],
      min: [1, 'Delivery radius must be at least 1 km'],
      max: [50, 'Delivery radius cannot exceed 50 km']
    },
    minimumOrder: {
      type: Number,
      required: [true, 'Minimum order amount is required'],
      min: [0, 'Minimum order cannot be negative']
    },
    deliveryFee: {
      type: Number,
      required: [true, 'Delivery fee is required'],
      min: [0, 'Delivery fee cannot be negative']
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 0,
      min: [0, 'Free delivery threshold cannot be negative']
    },
    estimatedDeliveryTime: {
      min: {
        type: Number,
        required: true,
        min: [10, 'Minimum delivery time must be at least 10 minutes']
      },
      max: {
        type: Number,
        required: true,
        min: [15, 'Maximum delivery time must be at least 15 minutes']
      }
    }
  },
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
  images: {
    logo: {
      type: String,
      required: [true, 'Restaurant logo is required']
    },
    banner: {
      type: String,
      required: [true, 'Restaurant banner is required']
    },
    gallery: [{
      type: String
    }]
  },
  features: [{
    type: String,
    enum: [
      'delivery', 'pickup', 'dine-in', 'outdoor-seating', 'wifi',
      'parking', 'wheelchair-accessible', 'family-friendly', 'pet-friendly',
      'live-music', 'bar', 'happy-hour', 'catering', 'private-dining'
    ]
  }],
  paymentMethods: [{
    type: String,
    enum: ['cash', 'card', 'digital-wallet', 'online'],
    default: ['cash', 'card', 'online']
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  businessInfo: {
    licenseNumber: {
      type: String,
      required: [true, 'Business license number is required']
    },
    taxId: {
      type: String,
      required: [true, 'Tax ID is required']
    },
    establishedYear: {
      type: Number,
      min: [1900, 'Established year must be after 1900'],
      max: [new Date().getFullYear(), 'Established year cannot be in the future']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: [0, 'Total orders cannot be negative']
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Total revenue cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
restaurantSchema.index({ 'address.coordinates': '2dsphere' });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ 'rating.average': -1 });
restaurantSchema.index({ status: 1, isActive: 1 });
restaurantSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for full address
restaurantSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Virtual to check if restaurant is currently open
restaurantSchema.virtual('isCurrentlyOpen').get(function() {
  if (!this.isOpen || !this.isActive) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const todayHours = this.operatingHours.find(hours => hours.day === currentDay);
  
  if (!todayHours || todayHours.isClosed) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Method to calculate distance from a point
restaurantSchema.methods.distanceFrom = function(coordinates) {
  const [userLng, userLat] = coordinates;
  const [restLng, restLat] = this.address.coordinates;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (restLat - userLat) * Math.PI / 180;
  const dLng = (restLng - userLng) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(restLat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Method to check if delivery is available to a location
restaurantSchema.methods.canDeliverTo = function(coordinates) {
  const distance = this.distanceFrom(coordinates);
  return distance <= this.deliveryInfo.deliveryRadius;
};

// Method to update rating
restaurantSchema.methods.updateRating = async function(newRating) {
  const currentTotal = this.rating.average * this.rating.totalReviews;
  this.rating.totalReviews += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.totalReviews;
  await this.save();
};

// Static method to find restaurants near a location
restaurantSchema.statics.findNearby = function(coordinates, maxDistance = 10) {
  return this.find({
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    status: 'approved',
    isActive: true
  });
};

// Static method to search restaurants
restaurantSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    status: 'approved',
    isActive: true,
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery).sort({ 'rating.average': -1 });
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
