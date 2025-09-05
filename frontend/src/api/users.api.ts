import axiosInstance from '@/config/axiosConfig';
import type { UserSearchResult } from '@/hooks/useUserSearch';

export const getAllUsers = async (): Promise<UserSearchResult[]> => {
  const response = await axiosInstance.get('/api/v1/user/all');
  const users = response.data?.data;
  if (!users || !Array.isArray(users)) {
    return [];
  }
  return users.map((user: any) => ({
    id: user.id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    displayName: `${user.firstName} ${user.lastName}`,
    avatarUrl: undefined,
  }));
};

export const searchUsers = async (
  query: string
): Promise<UserSearchResult[]> => {
  const response = await axiosInstance.get(
    `/api/v1/user/search?query=${encodeURIComponent(query)}`
  );
  const users = response.data?.data;
  if (!users || !Array.isArray(users)) {
    return [];
  }
  return users.map((user: any) => ({
    id: user.id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    displayName: `${user.firstName} ${user.lastName}`,
    avatarUrl: undefined,
  }));
};
