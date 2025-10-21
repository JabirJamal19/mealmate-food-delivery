import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { initializeAuth } from '@/store/slices/authSlice'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Restaurants from '@/pages/Restaurants'
import RestaurantDetail from '@/pages/RestaurantDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Orders from '@/pages/Orders'
import OrderDetail from '@/pages/OrderDetail'
import Profile from '@/pages/Profile'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

// Company Pages
import AboutUs from '@/pages/AboutUs'
import Careers from '@/pages/Careers'
import Press from '@/pages/Press'
import HelpCenter from '@/pages/HelpCenter'
import ContactUs from '@/pages/ContactUs'
import TermsOfService from '@/pages/TermsOfService'

// Restaurant Dashboard
import RestaurantDashboard from '@/pages/restaurant/Dashboard'
import RestaurantOrders from '@/pages/restaurant/Orders'
import RestaurantMenu from '@/pages/restaurant/Menu'
import RestaurantProfile from '@/pages/restaurant/Profile'

// Admin Dashboard
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminRestaurants from '@/pages/admin/Restaurants'
import AdminOrders from '@/pages/admin/Orders'

function App() {
  const dispatch = useDispatch()
  const { isInitialized } = useAuth()

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner h-8 w-8"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="restaurants/:id" element={<RestaurantDetail />} />
        
        {/* Company Pages */}
        <Route path="about" element={<AboutUs />} />
        <Route path="careers" element={<Careers />} />
        <Route path="press" element={<Press />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="terms" element={<TermsOfService />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Customer Routes */}
        <Route path="cart" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="orders/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderDetail />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* Restaurant Dashboard Routes */}
      <Route path="/restaurant" element={
        <ProtectedRoute allowedRoles={['restaurant']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<RestaurantDashboard />} />
        <Route path="orders" element={<RestaurantOrders />} />
        <Route path="menu" element={<RestaurantMenu />} />
        <Route path="profile" element={<RestaurantProfile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
