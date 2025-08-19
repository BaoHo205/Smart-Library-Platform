import axios, { AxiosError } from 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig<> {
    _retry?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - handles token refresh automatically
let refreshing = false;
let waiters: Array<() => void> = [];

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!refreshing) {
        refreshing = true;
        try {
          // Call refresh endpoint
          await axios.post(
            'http://localhost:5000/auth/refresh',
            {},
            { withCredentials: true }
          );

          // Resolve all waiting requests
          waiters.forEach(waiter => waiter());
          waiters = [];
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login';
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

export default axiosInstance;
