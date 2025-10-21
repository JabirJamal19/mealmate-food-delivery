// User Types
export interface User {
  _id: string
  email: string
  role: 'customer' | 'restaurant' | 'driver' | 'admin'
  profile: {
    firstName: string
    lastName: string
    phone?: string
    avatar?: string
    dateOfBirth?: string
  }
  addresses: Address[]
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    dietary: string[]
    cuisinePreferences: string[]
  }
  stripeCustomerId?: string
  isActive: boolean
  isEmailVerified: boolean
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  _id: string
  type: 'home' | 'work' | 'other'
  street: string
  city: string
  state?: string
  zipCode?: string
  country: string
  coordinates: [number, number] // [longitude, latitude]
  isDefault: boolean
}

// Restaurant Types
export interface Restaurant {
  _id: string
  ownerId: string
  name: string
  description: string
  cuisine: string[]
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates: [number, number]
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  operatingHours: OperatingHour[]
  deliveryInfo: {
    deliveryRadius: number
    minimumOrder: number
    deliveryFee: number
    freeDeliveryThreshold: number
    estimatedDeliveryTime: {
      min: number
      max: number
    }
  }
  rating: {
    average: number
    totalReviews: number
  }
  images: {
    logo: string
    banner: string
    gallery: string[]
  }
  features: string[]
  paymentMethods: string[]
  tags: string[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  businessInfo: {
    licenseNumber: string
    taxId: string
    establishedYear?: number
  }
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  isActive: boolean
  isFeatured: boolean
  isOpen: boolean
  totalOrders: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

export interface OperatingHour {
  day: string
  open: string
  close: string
  isClosed: boolean
}

// Menu Item Types
export interface MenuItem {
  _id: string
  restaurantId: string
  name: string
  description: string
  category: string
  price: number
  originalPrice?: number
  images: string[]
  ingredients: Ingredient[]
  nutritionalInfo?: NutritionalInfo
  dietary: string[]
  allergens: string[]
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extra-hot'
  preparationTime: number
  servingSize: string
  customizations: Customization[]
  variants: Variant[]
  tags: string[]
  rating: {
    average: number
    totalReviews: number
  }
  popularity: {
    orderCount: number
    viewCount: number
  }
  availability: {
    isAvailable: boolean
    availableQuantity?: number
    availableDays: string[]
    availableHours?: {
      start: string
      end: string
    }
  }
  isActive: boolean
  isFeatured: boolean
  isSpecial: boolean
  specialOffer?: SpecialOffer
  createdAt: string
  updatedAt: string
}

export interface Ingredient {
  name: string
  isOptional: boolean
  extraCost: number
}

export interface NutritionalInfo {
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface Customization {
  name: string
  type: 'single-select' | 'multi-select' | 'text-input'
  required: boolean
  options: CustomizationOption[]
  maxSelections?: number
}

export interface CustomizationOption {
  name: string
  price: number
}

export interface Variant {
  name: string
  price: number
  description?: string
}

export interface SpecialOffer {
  type: 'percentage' | 'fixed-amount' | 'buy-one-get-one'
  value: number
  validFrom?: string
  validUntil?: string
  description?: string
}

// Order Types
export interface Order {
  _id: string
  orderNumber: string
  customerId: string
  restaurantId: Restaurant
  driverId?: string
  items: OrderItem[]
  orderType: 'delivery' | 'pickup'
  status: OrderStatus
  deliveryAddress?: Address
  customerInfo: {
    name: string
    phone: string
    email: string
  }
  pricing: {
    subtotal: number
    deliveryFee: number
    serviceFee: number
    tax: number
    discount: {
      amount: number
      code?: string
      description?: string
    }
    tip: number
    total: number
  }
  payment: {
    method: 'card' | 'cash' | 'digital-wallet'
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
    transactionId?: string
    stripePaymentIntentId?: string
    paidAt?: string
    refundedAt?: string
    refundAmount: number
  }
  timing: {
    placedAt: string
    confirmedAt?: string
    preparationStartedAt?: string
    readyAt?: string
    pickedUpAt?: string
    deliveredAt?: string
    estimatedDeliveryTime?: string
    actualDeliveryTime?: string
    preparationTime?: number
  }
  tracking: {
    driverLocation?: {
      coordinates: [number, number]
      lastUpdated: string
    }
    statusHistory: StatusHistory[]
  }
  communication: {
    customerNotes?: string
    restaurantNotes?: string
    driverNotes?: string
  }
  rating?: {
    overall: number
    food?: number
    delivery?: number
    review?: string
    ratedAt: string
  }
  cancellation?: {
    reason: string
    cancelledBy: string
    cancelledAt: string
    refundProcessed: boolean
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  customizations: OrderCustomization[]
  specialInstructions?: string
  subtotal: number
}

export interface OrderCustomization {
  name: string
  selectedOptions: string[]
  additionalCost: number
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export interface StatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
  updatedBy?: string
}

// Cart Types
export interface CartItem {
  menuItem: MenuItem
  quantity: number
  customizations: OrderCustomization[]
  specialInstructions?: string
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  restaurantId?: string
  subtotal: number
  itemCount: number
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface PaginationResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: 'customer' | 'restaurant' | 'driver'
  profile: {
    firstName: string
    lastName: string
    phone?: string
    dateOfBirth?: string
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
}

// Filter Types
export interface RestaurantFilters {
  search?: string
  cuisine?: string[]
  minRating?: number
  maxDeliveryFee?: number
  maxDeliveryTime?: number
  latitude?: number
  longitude?: number
  radius?: number
  sort?: 'rating' | 'distance' | 'deliveryTime' | 'deliveryFee' | 'name'
}

export interface MenuFilters {
  category?: string
  search?: string
  sort?: 'price-low' | 'price-high' | 'rating' | 'popular' | 'category'
}

// Socket Types
export interface SocketEvents {
  'order:status_update': {
    orderId: string
    orderNumber: string
    status: OrderStatus
    timestamp: string
  }
  'order:driver_assigned': {
    orderId: string
    driverInfo: {
      name: string
      phone: string
      vehicle: string
    }
  }
  'order:location_update': {
    orderId: string
    coordinates: [number, number]
    timestamp: string
  }
  'restaurant:new_order': {
    orderId: string
    orderNumber: string
    customerName: string
    total: number
    items: number
  }
  'payment:confirmed': {
    orderId: string
    orderNumber: string
    amount: number
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
