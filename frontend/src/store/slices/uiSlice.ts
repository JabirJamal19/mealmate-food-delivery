import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isSidebarOpen: boolean
  isLoading: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  modals: {
    isLoginOpen: boolean
    isRegisterOpen: boolean
    isCartOpen: boolean
    isMenuItemOpen: boolean
    selectedMenuItem: string | null
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

const initialState: UIState = {
  isSidebarOpen: false,
  isLoading: false,
  theme: 'light',
  notifications: [],
  modals: {
    isLoginOpen: false,
    isRegisterOpen: false,
    isCartOpen: false,
    isMenuItemOpen: false,
    selectedMenuItem: null,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload
    },

    // Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    initializeTheme: (state) => {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (storedTheme) {
        state.theme = storedTheme
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        state.theme = prefersDark ? 'dark' : 'light'
      }
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 15),
        timestamp: Date.now(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },

    // Modals
    openLoginModal: (state) => {
      state.modals.isLoginOpen = true
      state.modals.isRegisterOpen = false
    },
    closeLoginModal: (state) => {
      state.modals.isLoginOpen = false
    },
    openRegisterModal: (state) => {
      state.modals.isRegisterOpen = true
      state.modals.isLoginOpen = false
    },
    closeRegisterModal: (state) => {
      state.modals.isRegisterOpen = false
    },
    openCartModal: (state) => {
      state.modals.isCartOpen = true
    },
    closeCartModal: (state) => {
      state.modals.isCartOpen = false
    },
    openMenuItemModal: (state, action: PayloadAction<string>) => {
      state.modals.isMenuItemOpen = true
      state.modals.selectedMenuItem = action.payload
    },
    closeMenuItemModal: (state) => {
      state.modals.isMenuItemOpen = false
      state.modals.selectedMenuItem = null
    },
    closeAllModals: (state) => {
      state.modals.isLoginOpen = false
      state.modals.isRegisterOpen = false
      state.modals.isCartOpen = false
      state.modals.isMenuItemOpen = false
      state.modals.selectedMenuItem = null
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  setTheme,
  initializeTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  openCartModal,
  closeCartModal,
  openMenuItemModal,
  closeMenuItemModal,
  closeAllModals,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui
export const selectIsSidebarOpen = (state: { ui: UIState }) => state.ui.isSidebarOpen
export const selectIsLoading = (state: { ui: UIState }) => state.ui.isLoading
export const selectTheme = (state: { ui: UIState }) => state.ui.theme
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications
export const selectModals = (state: { ui: UIState }) => state.ui.modals
