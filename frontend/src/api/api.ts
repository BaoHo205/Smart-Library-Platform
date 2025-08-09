import { axiosInstance } from "@/config/axiosConfig";

export interface LoginData {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
    };
}

const login = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post('/auth/login', loginData);

        // Store access token in localStorage
        if (response.data.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

const logout = async (): Promise<void> => {
    try {
        localStorage.removeItem('accessToken');

        const response = await axiosInstance.post('/auth/logout');

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Logout failed');
    } finally {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
}

const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
}

export default {
    login,
    logout,
    isAuthenticated
}

