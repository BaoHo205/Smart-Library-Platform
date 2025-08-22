'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useUser from '@/hooks/useUser';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, loading, checkAuth } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Run auth check on initial load
    const runInitialAuthCheck = async () => {
      await checkAuth();
      setInitialCheckDone(true);
    };

    runInitialAuthCheck();
  }, [checkAuth]);

  useEffect(() => {
    // Don't redirect until we've done the initial auth check
    if (!initialCheckDone || loading) {
      return;
    }

    // Redirect authenticated users away from login page
    if (isAuthenticated && pathname === '/login') {
      router.replace('/');
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
      return;
    }
  }, [isAuthenticated, loading, pathname, router, initialCheckDone]);

  // Show loading spinner while checking authentication
  if (loading || !initialCheckDone) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
