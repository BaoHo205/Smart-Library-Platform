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

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

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
          const response = await axios.post(
            'http://localhost:5000/auth/refresh',
            {
              withCredentials: true,
            }
          );

          const newToken = response.data?.data?.accessToken;
          if (newToken) {
            localStorage.setItem('accessToken', newToken);
          }

          // Resolve all waiting requests
          waiters.forEach(waiter => waiter());
          waiters = [];
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
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
