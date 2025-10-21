import { useAppSelector, useAppDispatch } from '@/store/store'
import { 
  selectAuth, 
  selectUser, 
  selectIsAuthenticated, 
  selectIsLoading,
  selectIsInitialized,
  logout as logoutAction 
} from '@/store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectIsLoading)
  const isInitialized = useAppSelector(selectIsInitialized)

  const logout = () => {
    dispatch(logoutAction())
  }

  const hasRole = (roles: string | string[]) => {
    if (!user) return false
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return allowedRoles.includes(user.role)
  }

  return {
    ...auth,
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    logout,
    hasRole,
  }
}
