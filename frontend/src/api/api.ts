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
export interface IReview {
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

export interface BorrowBookResponse {
  success: boolean;
  message: string;
  data?: {
    checkoutId: string;
    userId: string;
    bookId: string;
    dueDate: string;
    checkoutDate: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: IReview[];
  message?: string;
}

const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = (await axiosInstance.post(
      '/auth/login',
      loginData
    )) as AuthResponse;

    return {
      success: true,
      message: response.message,
      data: response.data || {},
    };
  } catch (error) {
    // console.error('Login failed:', error);
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
const getReviewsByBookId = async (bookId: string): Promise<IReview[]> => {
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
): Promise<IReview> => {
  try {
    const reviewData = {
      bookId,
      rating,
      comment,
    };
    const response = await axiosInstance.post(
      '/api/v1/user/reviews/add',
      reviewData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to add review for book ID ${bookId}:`, error);
    throw error;
  }
};

const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
): Promise<IReview> => {
  try {
    const reviewData = {
      rating,
      comment,
    };
    const response = await axiosInstance.put(
      `/api/v1/user/reviews/update/${reviewId}`,
      reviewData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update review with ID ${reviewId}:`, error);
    throw error;
  }
};

const borrowBook = async (
  bookId: string,
  dueDate: string
): Promise<BorrowBookResponse> => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/books/borrow/${bookId}`,
      { dueDate }
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to borrow book with ID ${bookId}:`, error);
    throw error;
  }
};

const isBookBorrowed = async (bookId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/books/${bookId}/isBorrowed`
    );
    return response.data.isBorrowed || false;
  } catch (error) {
    console.error(
      `Failed to check borrow status for book ID ${bookId}:`,
      error
    );
    return false;
  }
};

export default {
  login,
  logout,
  addReview,
  getBookInfoById,
  getReviewsByBookId,
  updateReview,
  borrowBook,
  isBookBorrowed,
};
