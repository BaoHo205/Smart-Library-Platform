export interface Book {
  id: string;
  title: string;
  authors: string;
  genres: string;
  isbn: string;
  description: string;
  publishedDate: string;
  thumbnailUrl: string;
  availableCopies: number;
  totalCopies: number;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllBooksParams {
  currentGenre: string;
  currentPage: number;
  searchParam: string;
  searchInput: string;
}

export interface GetAllBooksResponse {
  data: Book[];
  page: number;
  pageSize: number;
  total: number;
}

export interface BooksApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

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


export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  name: string;
  userAvatar?: string;
}

export interface BookReviewsProps {
  bookId: string;
  reviews: Review[] | [];
  onAddReview: (bookId: string, rating: number, comment: string) => void;
  onUpdateReview: (bookId: string, rating: number, comment: string) => void;
  currentUserId?: string; 
  isBorrowed: boolean;
}
