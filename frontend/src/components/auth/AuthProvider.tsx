'use client'
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useUser from '@/hooks/useUser';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Redirect authenticated users away from login page
    if (isAuthenticated && pathname === '/login') {
      router.replace('/');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
