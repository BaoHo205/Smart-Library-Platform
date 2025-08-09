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

export interface AuthError {
    success: boolean;
    message: string;
}

const login = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post('/auth/login', loginData) as AuthResponse;

        // Store access token in localStorage
        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const logout = async (): Promise<void> => {
    try {
        localStorage.removeItem('accessToken');

        const response = await axiosInstance.post('/auth/logout');

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
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

