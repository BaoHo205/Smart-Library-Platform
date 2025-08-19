import { axiosInstance } from '@/config/axiosConfig';

// BookDetails interface to match backend
export interface BookDetails {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  isbn: string;
  quantity: number;
  availableCopies: number;
  pageCount: number;
  description: string | null;
  status: 'available' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
  avgRating: number;
  numberOfRatings: number;
  authors: string[];
  genres: string[];
  publisherName: string;
}

// ReviewWithUser interface to match backend
export interface ReviewWithUser {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  name: string;
}

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

export interface BookResponse {
  success: boolean;
  data: BookDetails;
  message?: string;
}

// Review interfaces
// export interface Review {
//   id: string;
//   bookId: string;
//   userId: string;
//   userName: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
// }

export interface ReviewsResponse {
  success: boolean;
  data: ReviewWithUser[];
  message?: string;
}

const login = async (loginData: LoginData): Promise<AuthResponse> => {

  try {
    const response = await axiosInstance.post('/auth/login', loginData) as AuthResponse;

    return {
      success: true,
      message: response.message,
      data: response.data || {},
    };
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed.')
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

// const isAuthenticated = () => {
//   return !!localStorage.getItem('accessToken');
// };


// Get book info by ID
const getBookInfoById = async (bookId: string): Promise<BookDetails> => {
  try {
    const response = await axiosInstance.get(`/api/v1/books/${bookId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch book with ID ${bookId}:`, error);
    throw error;
  }
};

// Get all reviews for a book by ID
const getReviewsByBookId = async (bookId: string): Promise<ReviewWithUser[]> => {
  try {
    const response = await axiosInstance.get(`/api/v1/books/${bookId}/reviews`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch reviews for book ID ${bookId}:`, error);
    throw error;
  }
};

// Add a review for a book
const addReview = async (
  bookId: string,
  rating: number,
  comment: string
): Promise<ReviewWithUser> => {
  try {
    const reviewData = {
      bookId,
      rating,
      comment
    };
    const response = await axiosInstance.post('/api/v1/users/reviews/add', reviewData);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to add review for book ID ${bookId}:`, error);
    throw error;
  }
};



export default {
  login,
  logout,
  addReview,
  getBookInfoById,
  getReviewsByBookId,
};
