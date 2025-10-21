import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User, AuthTokens } from '@/types'

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      try {
        const storedTokens = localStorage.getItem('auth_tokens')
        const storedUser = localStorage.getItem('auth_user')
        
        if (storedTokens && storedUser) {
          state.tokens = JSON.parse(storedTokens)
          state.user = JSON.parse(storedUser)
          state.isAuthenticated = true
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error)
        // Clear corrupted data
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('auth_user')
      } finally {
        state.isInitialized = true
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      const { user, tokens } = action.payload
      
      state.user = user
      state.tokens = tokens
      state.isAuthenticated = true
      state.isLoading = false
      
      // Persist to localStorage
      localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      localStorage.setItem('auth_user', JSON.stringify(user))
    },

    // Login failure
    loginFailure: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.isLoading = false
      
      // Clear localStorage
      localStorage.removeItem('auth_tokens')
      localStorage.removeItem('auth_user')
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('auth_user', JSON.stringify(state.user))
      }
    },

    // Update tokens
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload
      localStorage.setItem('auth_tokens', JSON.stringify(action.payload))
    },

    // Logout
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.isLoading = false
      
      // Clear localStorage
      localStorage.removeItem('auth_tokens')
      localStorage.removeItem('auth_user')
      
      // Clear other stored data
      localStorage.removeItem('cart')
    },

    // Clear auth state (for errors)
    clearAuth: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.isLoading = false
      
      // Clear localStorage
      localStorage.removeItem('auth_tokens')
      localStorage.removeItem('auth_user')
    },
  },
})

export const {
  initializeAuth,
  setLoading,
  loginSuccess,
  loginFailure,
  updateUser,
  updateTokens,
  logout,
  clearAuth,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectTokens = (state: { auth: AuthState }) => state.auth.tokens
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role
