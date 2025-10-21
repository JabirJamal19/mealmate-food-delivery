import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';
import toast from 'react-hot-toast';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual signup API call
      console.log('SignUp data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('SignUp error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
    </div>
  );
};

export default Register;
