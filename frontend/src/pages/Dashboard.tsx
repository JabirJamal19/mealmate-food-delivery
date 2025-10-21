import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  ShoppingBag, 
  Clock, 
  Star, 
  CreditCard, 
  User,
  Heart,
  Settings
} from 'lucide-react';

interface Order {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  status: string;
  date: string;
  image: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  favoriteRestaurants: number;
  avgRating: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteRestaurants: 0,
    avgRating: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API calls
    setRecentOrders([
      {
        id: '1',
        restaurant: 'Pizza Palace',
        items: ['Margherita Pizza', 'Garlic Bread'],
        total: 24.99,
        status: 'delivered',
        date: '2024-10-19',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
      },
      {
        id: '2',
        restaurant: 'Burger House',
        items: ['Classic Burger', 'Fries'],
        total: 18.50,
        status: 'delivered',
        date: '2024-10-18',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop'
      },
      {
        id: '3',
        restaurant: 'Sushi Express',
        items: ['California Roll', 'Miso Soup'],
        total: 32.00,
        status: 'preparing',
        date: '2024-10-20',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop'
      }
    ]);

    setFavoriteRestaurants([
      {
        id: '1',
        name: 'Pizza Palace',
        cuisine: 'Italian',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150'
      },
      {
        id: '2',
        name: 'Burger House',
        cuisine: 'American',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=150&fit=crop'
      }
    ]);

    setStats({
      totalOrders: 47,
      totalSpent: 1247.50,
      favoriteRestaurants: 8,
      avgRating: 4.7
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'on-the-way': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'preparing': return 'Preparing';
      case 'on-the-way': return 'On the way';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.profile?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your orders and favorites.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteRestaurants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <img 
                        src={order.image} 
                        alt={order.restaurant}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{order.restaurant}</h3>
                        <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm font-medium text-gray-900">${order.total}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <span className="text-xs text-gray-500">{order.date}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link 
                    to="/restaurants" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Order Food</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Edit Profile</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Order History</span>
                  </Link>
                  <Link 
                    to="/help" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Help & Support</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Favorite Restaurants */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Favorite Restaurants</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {favoriteRestaurants.map((restaurant) => (
                    <Link 
                      key={restaurant.id}
                      to={`/restaurants/${restaurant.id}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{restaurant.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
