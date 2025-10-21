import { Link } from 'react-router-dom'
import { Star, Clock, TrendingUp, Flame } from 'lucide-react'

const Home = () => {
  const trendingFoods = [
    {
      id: 1,
      name: 'Margherita Pizza',
      restaurant: 'Pizza Palace',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200',
      rating: 4.8,
      orders: '2.5k orders',
      tag: 'Most Popular'
    },
    {
      id: 2,
      name: 'Chicken Burger',
      restaurant: 'Burger House',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200',
      rating: 4.6,
      orders: '1.8k orders',
      tag: 'Trending'
    },
    {
      id: 3,
      name: 'California Roll',
      restaurant: 'Sushi Express',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200',
      rating: 4.9,
      orders: '1.2k orders',
      tag: 'Chef\'s Choice'
    },
    {
      id: 4,
      name: 'Chicken Tacos',
      restaurant: 'Taco Fiesta',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
      rating: 4.5,
      orders: '2.1k orders',
      tag: 'Best Value'
    }
  ];

  const featuredRestaurants = [
    {
      id: 1,
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
      specialOffer: '20% OFF'
    },
    {
      id: 2,
      name: 'Sushi Express',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '30-40 min',
      deliveryFee: 3.99,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250',
      specialOffer: 'Free Delivery'
    },
    {
      id: 3,
      name: 'Burger House',
      cuisine: 'American',
      rating: 4.6,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250',
      specialOffer: 'Buy 1 Get 1'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative min-h-screen flex items-center">
        {/* Background Image/Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080" 
            alt="Delicious food background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              Delicious Food, <span className="text-primary-400">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/restaurants"
                className="btn-primary btn-lg px-10 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Order Now
              </Link>
              <Link
                to="/register"
                className="btn-outline btn-lg px-10 py-4 text-xl font-semibold border-white text-white hover:bg-white hover:text-gray-900 shadow-lg"
              >
                Sign Up
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">500K+</div>
                <div className="text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">2,500+</div>
                <div className="text-gray-300">Partner Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">25+</div>
                <div className="text-gray-300">Cities Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Foods Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Flame className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the most popular dishes that everyone's ordering right now
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingFoods.map((food) => (
              <div key={food.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="relative">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {food.tag}
                  </div>
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {food.orders}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{food.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{food.restaurant}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{food.rating}</span>
                    </div>
                    <div className="text-lg font-bold text-primary-600">${food.price}</div>
                  </div>
                  <button className="w-full mt-3 btn-primary btn-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of top-rated restaurants with special offers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <Link 
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {restaurant.specialOffer}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.cuisine} Cuisine</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div>${restaurant.deliveryFee} delivery</div>
                  </div>
                  <button className="w-full btn-primary btn-md">
                    View Menu
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/restaurants" className="btn-outline btn-lg">
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MealMate?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the best food delivery service with our amazing features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered in 30 minutes or less with our lightning-fast delivery network</p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Food</h3>
              <p className="text-gray-600">Fresh ingredients from top-rated restaurants, ensuring every meal is delicious</p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Payment</h3>
              <p className="text-gray-600">Secure payment with multiple options including cards, digital wallets, and cash</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - see what our satisfied customers have to say about MealMate
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&crop=face" 
                  alt="Sarah Johnson"
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <div className="flex text-yellow-400 text-lg">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "MealMate has completely changed how I order food. The delivery is always fast and the food arrives hot. 
                My go-to app for busy weeknights!"
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60&crop=face" 
                  alt="Michael Chen"
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <div className="flex text-yellow-400 text-lg">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Amazing variety of restaurants and the user interface is so intuitive. 
                I love being able to track my order in real-time. Highly recommended!"
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60&crop=face" 
                  alt="Emily Rodriguez"
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Emily Rodriguez</h4>
                  <div className="flex text-yellow-400 text-lg">
                    {'★'.repeat(4)}★
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Great customer service and reliable delivery times. The app makes it so easy to discover new restaurants. 
                MealMate is definitely my favorite food delivery service!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
