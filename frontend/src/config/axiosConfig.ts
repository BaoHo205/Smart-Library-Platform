import axios, { AxiosError } from "axios";

declare module 'axios' {
    interface InternalAxiosRequestConfig<D = any> {
        _retry?: boolean;
    }
}

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('accessToken');
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmQ4Mzc2Mi0yODEyLTRhZTYtODYyMy0xOTBmYjU2Mzc4NjUiLCJyb2xlIjoidXNlciIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTU1MjczMzEsImV4cCI6MTc1NTUyOTEzMX0.mMP20o1kXtO_v7ij736-fpTu6pG9DG9qJrhT67VBVG4";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles token refresh automatically
let refreshing = false;
let waiters: Array<() => void> = [];


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshing) {
                refreshing = true;
                try {
                    // Call refresh endpoint
                    const response = await axios.post('http://localhost:5000/auth/refresh', {
                        withCredentials: true
                    });

                    const newToken = response.data?.data?.accessToken;
                    if (newToken) {
                        localStorage.setItem('accessToken', newToken);
                    }

                    // Resolve all waiting requests
                    waiters.forEach((waiter) => waiter());
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
            await new Promise<void>((resolve) => waiters.push(resolve));
            return axiosInstance(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;