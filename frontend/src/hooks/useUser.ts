'use client'
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/config/axiosConfig';

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "staff";
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasCheckedAuth = useRef(false);

  const checkAuth = async () => {
    // Prevent multiple simultaneous auth checks
    if (hasCheckedAuth.current) {
      return;
    }
    hasCheckedAuth.current = true;

    try {
      // Check if we have a token in localStorage
      const response = await axiosInstance.get('/api/v1/user/profile');

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        // Token is invalid
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Remove invalid token
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call the logout API endpoint which will clear the cookies
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Update local state
      setUser(null);
      setIsAuthenticated(false);
      hasCheckedAuth.current = false; // Reset for next login

      // Redirect to login page
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      checkAuth();
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    checkAuth
  };
};

export default useUser;
