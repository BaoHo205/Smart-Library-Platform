import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Add _retry to axios request config via declaration merging
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Client instance (browser). We'll attach the refresh interceptor only on the client
export const axiosInstance = axios.create({
  baseURL: DEFAULT_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a server-safe axios instance. Pass the incoming Cookie header if you
 * need to forward authentication cookies from the incoming request (SSR).
 */
export function createServerAxios(cookie?: string) {
  return axios.create({
    baseURL: DEFAULT_BASE,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });
}

// Response interceptor - handles token refresh automatically (browser only)
if (typeof window !== 'undefined') {
  let refreshing = false;
  let waiters: Array<() => void> = [];

  axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        // Skip refresh logic if we're on login page or calling auth endpoints
        const isAuthEndpoint =
          originalRequest.url?.includes('/auth/') ||
          originalRequest.url?.includes('/user/profile');

        if (isAuthEndpoint || window.location.pathname === '/login') {
          return Promise.reject(error);
        }

        if (!refreshing) {
          refreshing = true;
          try {
            // Call refresh endpoint
            await axios.post(
              `${DEFAULT_BASE}/auth/refresh`,
              {},
              { withCredentials: true }
            );

            // Resolve all waiting requests
            waiters.forEach(waiter => waiter());
            waiters = [];
          } catch (refreshError) {
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            refreshing = false;
          }
        }

        // Wait for refresh to complete
        await new Promise<void>(resolve => waiters.push(resolve));
        return axiosInstance(originalRequest);
      }

      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
