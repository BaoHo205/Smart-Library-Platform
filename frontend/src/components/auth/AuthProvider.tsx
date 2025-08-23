'use client';
import { useState, useEffect, useRef, ReactNode, createContext } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'staff';
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasCheckedAuth = useRef(false);
  const pathname = usePathname();

  const checkAuth = async () => {
    if (pathname === '/login') {
      setLoading(false);
      return;
    }
    if (hasCheckedAuth.current) {
      return;
    }

    try {
      // Check if we have a token in cookie
      const response = await axiosInstance.get('/api/v1/user/profile');

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        hasCheckedAuth.current = true;
      } else {
        // Token is invalid
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
    if (!hasCheckedAuth.current && pathname !== '/login') {
      checkAuth();
    }
  }, []);

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
