import axiosInstance from '@/config/axiosConfig';
import type { LoginData, AuthResponse } from '@/types/auth.type';

export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = (await axiosInstance.post(
      '/auth/login',
      loginData
    )) as unknown as AuthResponse;

    return {
      success: true,
      message: response.message,
      data: response.data || ({} as AuthResponse['data']),
    } as AuthResponse;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    window.location.href = '/login';
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    window.location.href = '/login';
  }
};
