export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    role: string;
    accessToken: string;
  };
}

export interface AuthError {
  success: boolean;
  message: string;
}

export interface AuthUser {
  id: string;
  name: string;
  displayName: string;
  role: 'user' | 'staff';
  avatarUrl?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
