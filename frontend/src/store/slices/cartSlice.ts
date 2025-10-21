import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Cart, CartItem, MenuItem, OrderCustomization } from '@/types'

const initialState: Cart = {
  items: [],
  restaurantId: undefined,
  subtotal: 0,
  itemCount: 0,
}

// Helper function to calculate item subtotal
const calculateItemSubtotal = (
  menuItem: MenuItem,
  quantity: number,
  customizations: OrderCustomization[]
): number => {
  const basePrice = menuItem.discountedPrice || menuItem.price
  const customizationCost = customizations.reduce(
    (total, customization) => total + customization.additionalCost,
    0
  )
  return (basePrice + customizationCost) * quantity
}

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  return { subtotal, itemCount }
}

// Helper function to save cart to localStorage
const saveCartToStorage = (cart: Cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

// Helper function to load cart from localStorage
const loadCartFromStorage = (): Cart => {
  try {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      return JSON.parse(storedCart)
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }
  return initialState
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    // Add item to cart
    addToCart: (
      state,
      action: PayloadAction<{
        menuItem: MenuItem
        quantity: number
        customizations: OrderCustomization[]
        specialInstructions?: string
      }>
    ) => {
      const { menuItem, quantity, customizations, specialInstructions } = action.payload

      // Check if adding from different restaurant
      if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
        // Clear cart and start fresh with new restaurant
        state.items = []
        state.restaurantId = menuItem.restaurantId
      } else if (!state.restaurantId) {
        state.restaurantId = menuItem.restaurantId
      }

      // Check if item with same customizations already exists
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.menuItem._id === menuItem._id &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
          item.specialInstructions === specialInstructions
      )

      const subtotal = calculateItemSubtotal(menuItem, quantity, customizations)

      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = state.items[existingItemIndex]
        existingItem.quantity += quantity
        existingItem.subtotal = calculateItemSubtotal(
          menuItem,
          existingItem.quantity,
          customizations
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          menuItem,
          quantity,
          customizations,
          specialInstructions,
          subtotal,
        }
        state.items.push(newItem)
      }

      // Recalculate totals
      const totals = calculateCartTotals(state.items)
      state.subtotal = totals.subtotal
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },

    // Update item quantity
    updateItemQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) => {
      const { index, quantity } = action.payload

      if (index >= 0 && index < state.items.length) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(index, 1)
        } else {
          // Update quantity and subtotal
          const item = state.items[index]
          item.quantity = quantity
          item.subtotal = calculateItemSubtotal(
            item.menuItem,
            quantity,
            item.customizations
          )
        }

        // Recalculate totals
        const totals = calculateCartTotals(state.items)
        state.subtotal = totals.subtotal
        state.itemCount = totals.itemCount

        // Clear restaurant if no items left
        if (state.items.length === 0) {
          state.restaurantId = undefined
        }

        saveCartToStorage(state)
      }
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      const index = action.payload

      if (index >= 0 && index < state.items.length) {
        state.items.splice(index, 1)

        // Recalculate totals
        const totals = calculateCartTotals(state.items)
        state.subtotal = totals.subtotal
        state.itemCount = totals.itemCount

        // Clear restaurant if no items left
        if (state.items.length === 0) {
          state.restaurantId = undefined
        }

        saveCartToStorage(state)
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = []
      state.restaurantId = undefined
      state.subtotal = 0
      state.itemCount = 0

      saveCartToStorage(state)
    },

    // Update item customizations
    updateItemCustomizations: (
      state,
      action: PayloadAction<{
        index: number
        customizations: OrderCustomization[]
        specialInstructions?: string
      }>
    ) => {
      const { index, customizations, specialInstructions } = action.payload

      if (index >= 0 && index < state.items.length) {
        const item = state.items[index]
        item.customizations = customizations
        item.specialInstructions = specialInstructions
        item.subtotal = calculateItemSubtotal(
          item.menuItem,
          item.quantity,
          customizations
        )

        // Recalculate totals
        const totals = calculateCartTotals(state.items)
        state.subtotal = totals.subtotal
        state.itemCount = totals.itemCount

        saveCartToStorage(state)
      }
    },

    // Initialize cart from localStorage
    initializeCart: (state) => {
      const storedCart = loadCartFromStorage()
      state.items = storedCart.items
      state.restaurantId = storedCart.restaurantId
      state.subtotal = storedCart.subtotal
      state.itemCount = storedCart.itemCount
    },

    // Sync cart with updated menu item prices
    syncCartPrices: (state, action: PayloadAction<MenuItem[]>) => {
      const updatedMenuItems = action.payload

      state.items = state.items.map((item) => {
        const updatedMenuItem = updatedMenuItems.find(
          (menuItem) => menuItem._id === item.menuItem._id
        )

        if (updatedMenuItem) {
          const updatedItem = {
            ...item,
            menuItem: updatedMenuItem,
            subtotal: calculateItemSubtotal(
              updatedMenuItem,
              item.quantity,
              item.customizations
            ),
          }
          return updatedItem
        }

        return item
      })

      // Recalculate totals
      const totals = calculateCartTotals(state.items)
      state.subtotal = totals.subtotal
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },
  },
})

export const {
  addToCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
  updateItemCustomizations,
  initializeCart,
  syncCartPrices,
} = cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCart = (state: { cart: Cart }) => state.cart
export const selectCartItems = (state: { cart: Cart }) => state.cart.items
export const selectCartSubtotal = (state: { cart: Cart }) => state.cart.subtotal
export const selectCartItemCount = (state: { cart: Cart }) => state.cart.itemCount
export const selectCartRestaurantId = (state: { cart: Cart }) => state.cart.restaurantId
export const selectIsCartEmpty = (state: { cart: Cart }) => state.cart.items.length === 0

// Get cart item by menu item ID and customizations
export const selectCartItemByMenuItem = (
  state: { cart: Cart },
  menuItemId: string,
  customizations: OrderCustomization[] = []
) => {
  return state.cart.items.find(
    (item) =>
      item.menuItem._id === menuItemId &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
  )
}
