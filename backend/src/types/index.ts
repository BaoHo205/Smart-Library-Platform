export interface IUser {
  id: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface IRegistrationData {
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;
}

export enum UserRole {
  STAFF = 'staff',
  USER = 'user',
}

export interface ILoginData {
  username: string;
  password: string;
}

// Review interfaces
export interface IReviewData {
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
}

export interface IReviewResponse {
  success: number;
  message: string;
  reviewId: string | null;
}