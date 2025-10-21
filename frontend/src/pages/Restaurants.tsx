import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Search, Filter } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  description: string;
  address: string;
  isOpen: boolean;
  featured: boolean;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const cuisines = ['all', 'Italian', 'American', 'Asian', 'Mexican', 'Indian', 'Mediterranean'];

  useEffect(() => {
    // Mock restaurant data
    setRestaurants([
      {
        id: '1',
        name: 'Pizza Palace',
        cuisine: 'Italian',
        rating: 4.8,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        description: 'Authentic Italian pizzas with fresh ingredients',
        address: '123 Main St, Downtown',
        isOpen: true,
        featured: true
      },
      {
        id: '2',
        name: 'Burger House',
        cuisine: 'American',
        rating: 4.6,
        deliveryTime: '20-30 min',
        deliveryFee: 1.99,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
        description: 'Gourmet burgers and crispy fries',
        address: '456 Oak Ave, Midtown',
        isOpen: true,
        featured: false
      },
      {
        id: '3',
        name: 'Sushi Express',
        cuisine: 'Asian',
        rating: 4.9,
        deliveryTime: '30-40 min',
        deliveryFee: 3.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        description: 'Fresh sushi and Japanese cuisine',
        address: '789 Pine St, Uptown',
        isOpen: true,
        featured: true
      },
      {
        id: '4',
        name: 'Taco Fiesta',
        cuisine: 'Mexican',
        rating: 4.5,
        deliveryTime: '15-25 min',
        deliveryFee: 1.49,
        image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        description: 'Authentic Mexican tacos and burritos',
        address: '321 Elm St, Southside',
        isOpen: true,
        featured: false
      },
      {
        id: '5',
        name: 'Curry Corner',
        cuisine: 'Indian',
        rating: 4.7,
        deliveryTime: '35-45 min',
        deliveryFee: 2.49,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        description: 'Spicy Indian curries and naan bread',
        address: '654 Maple Dr, Eastside',
        isOpen: false,
        featured: false
      },
      {
        id: '6',
        name: 'Mediterranean Grill',
        cuisine: 'Mediterranean',
        rating: 4.4,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        description: 'Fresh Mediterranean dishes and grilled meats',
        address: '987 Cedar Ln, Westside',
        isOpen: true,
        featured: false
      }
    ]);
  }, []);

  const filteredRestaurants = restaurants
    .filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(restaurant => 
      selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'deliveryFee':
          return a.deliveryFee - b.deliveryFee;
        default:
          return 0;
      }
    });

  const featuredRestaurants = restaurants.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurants Near You</h1>
          <p className="text-gray-600">Discover amazing food from local restaurants</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine === 'all' ? 'All Cuisines' : cuisine}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="deliveryTime">Sort by Delivery Time</option>
              <option value="deliveryFee">Sort by Delivery Fee</option>
            </select>

            {/* Filter Button */}
            <button className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Featured Restaurants */}
        {featuredRestaurants.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map(restaurant => (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                    {!restaurant.isOpen && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Closed</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {restaurant.rating}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {restaurant.deliveryTime}
                      </span>
                      <span>${restaurant.deliveryFee} delivery</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {restaurant.address}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Restaurants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Restaurants ({filteredRestaurants.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Closed</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {restaurant.rating}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {restaurant.deliveryTime}
                    </span>
                    <span>${restaurant.deliveryFee} delivery</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {restaurant.address}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('all');
                }}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants
