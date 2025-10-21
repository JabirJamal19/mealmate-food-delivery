import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import toast from 'react-hot-toast';

interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual login API call
      console.log('Login data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate user role based on email (for demo purposes)
      let userRole = 'customer'; // default role
      if (data.email.includes('admin')) {
        userRole = 'admin';
      } else if (data.email.includes('restaurant')) {
        userRole = 'restaurant';
      }
      
      toast.success('Login successful!');
      
      // Redirect based on user role
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'restaurant':
          navigate('/restaurant');
          break;
        case 'customer':
        default:
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
};

export default Login;
