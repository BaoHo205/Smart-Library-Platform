import axiosInstance from '@/config/axiosConfig';
import { UserSearchResult } from '@/hooks/useUserSearch';
import {
  MostBorrowedBook,
  BookAvailability,
  TopActiveReader,
} from '@/lib/types';

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

// Reading Session Analytics Interfaces
export interface MostHighlightedBookResponse {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string | null;
  totalHighlights: number;
  uniqueReadersCount: number;
  totalSessions: number;
  avgHighlightsPerSession: number;
  highlightDensity: number;
}

export interface TopBookByReadingTimeResponse {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string | null;
  totalReadingTime: number;
  totalSessions: number;
  uniqueReadersCount: number;
  avgSessionDuration: number;
  totalPages: number;
  totalHighlights: number;
  engagementScore: number;
}

export interface ReadingTrendResponse {
  year: number;
  month: number;
  monthLabel: string;
  totalSessions: number;
  totalDuration: number;
  avgDuration: number;
  uniqueBooksCount: number;
  uniqueUsersCount: number;
}

export interface AverageSessionTimeResponse {
  userId: string;
  monthlyData: {
    month: string;
    totalSessions: number;
    totalDuration: number;
    averageDuration: number;
    activeDaysCount: number;
    dailyAverage: number;
  }[];
  overallAverage: number;
  overallDailyAverage: number;
}

export interface ReadingSessionAnalyticsResponse {
  success: boolean;
  data:
    | MostHighlightedBookResponse[]
    | TopBookByReadingTimeResponse[]
    | ReadingTrendResponse[]
    | AverageSessionTimeResponse[];
  message: string;
}

// Staff Reports Interfaces
// MostBorrowedBook, BookAvailability, TopActiveReader are imported from @/lib/types

// User Search Interfaces
// UserSearchResult is imported from @/hooks/useUserSearch

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
      {
        dueDate,
      }
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

// Reading Session Analytics API Functions
const getMostHighlightedBooksWithDetails = async (
  limit: number = 5
): Promise<MostHighlightedBookResponse[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/reading-sessions/most-highlighted-with-details?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      'Failed to fetch most highlighted books with details:',
      error
    );
    throw error;
  }
};

const getTopBooksByReadTimeWithDetails = async (
  limit: number = 10
): Promise<TopBookByReadingTimeResponse[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/reading-sessions/top-books-time-with-details?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      'Failed to fetch top books by reading time with details:',
      error
    );
    throw error;
  }
};

const getAverageSessionTime = async (): Promise<
  AverageSessionTimeResponse[]
> => {
  try {
    const response = await axiosInstance.get(
      '/api/v1/reading-sessions/avg-time'
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch average session time:', error);
    throw error;
  }
};

const getReadingTrends = async (
  userId?: string,
  months: number | 'all' = 6,
  dateRange?: { from: Date | undefined; to: Date | undefined }
): Promise<ReadingTrendResponse[]> => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    if (dateRange?.from && dateRange?.to) {
      // Use custom date range
      params.append('startDate', dateRange.from.toISOString().split('T')[0]);
      params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    } else {
      params.append('months', months.toString());
    }

    const response = await axiosInstance.get(
      `/api/v1/reading-sessions/trends?${params.toString()}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch reading trends:', error);
    throw error;
  }
};

// User search methods
const getAllUsers = async (): Promise<UserSearchResult[]> => {
  try {
    const response = await axiosInstance.get('/api/v1/user/all');
    return response.data.data.map((user: any) => ({
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      avatarUrl: undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch all users:', error);
    throw error;
  }
};

const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/user/search?query=${encodeURIComponent(query)}`
    );
    return response.data.data.map((user: any) => ({
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      avatarUrl: undefined,
    }));
  } catch (error) {
    console.error('Failed to search users:', error);
    throw error;
  }
};

// Staff Reports API
const getMostBorrowedBooks = async (
  startDate: string,
  endDate: string,
  limit: number = 5
): Promise<MostBorrowedBook[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/staff/most-borrowed-books?startDate=${startDate}&endDate=${endDate}&limit=${limit}`
    );
    const books = response.data.data || [];

    const booksWithDetails = await Promise.all(
      books.map(async (book: any) => {
        try {
          const bookDetailResponse = await axiosInstance.get(
            `/api/v1/books/${book.id}`
          );
          const bookDetail = bookDetailResponse.data.data;
          return {
            bookId: book.id || `book_${Date.now()}_${Math.random()}`,
            title: book.title || '',
            authors: book.authors || 'Unknown Author',
            total_checkouts: book.total_checkouts || 0,
            availableCopies: book.availableCopies || 0,
            quantity: book.quantity || 0,
            coverUrl: bookDetail?.thumbnailUrl || null,
          };
        } catch (error) {
          console.error(
            `Failed to fetch book details for ${book.title}:`,
            error
          );
          return {
            bookId: book.id || `book_${Date.now()}_${Math.random()}`,
            title: book.title || '',
            authors: book.authors || 'Unknown Author',
            total_checkouts: book.total_checkouts || 0,
            availableCopies: book.availableCopies || 0,
            quantity: book.quantity || 0,
            coverUrl: null,
          };
        }
      })
    );

    return booksWithDetails;
  } catch (error) {
    console.error('Error fetching most borrowed books:', error);
    throw error;
  }
};

const getBooksWithLowAvailability = async (
  interval: number = 60
): Promise<BookAvailability[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/staff/low-availability?interval=${interval}`
    );
    const books = response.data.data || [];

    // No need to fetch book details for low availability - just return the data
    return books.map((book: any) => ({
      bookId: book.id || `book_${Date.now()}_${Math.random()}`,
      title: book.title || '',
      availableCopies: book.availableCopies || 0,
      quantity: book.quantity || 0,
      availability_percentage: book.availability_percentage || 0,
      recent_checkouts: book.recent_checkouts || 0,
      coverUrl: null, // Low availability doesn't need cover images
    }));
  } catch (error) {
    console.error('Error fetching books with low availability:', error);
    throw error;
  }
};

const getTopActiveReaders = async (
  monthsBack: number = 6,
  limit: number = 10
): Promise<TopActiveReader[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/staff/top-active-readers?monthsBack=${monthsBack}&limit=${limit}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching top active readers:', error);
    throw error;
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
  // Reading Session Analytics
  getMostHighlightedBooksWithDetails,
  getTopBooksByReadTimeWithDetails,
  getAverageSessionTime,
  getReadingTrends,
  getAllUsers,
  searchUsers,
  // Staff Reports API
  getMostBorrowedBooks,
  getBooksWithLowAvailability,
  getTopActiveReaders,
};
