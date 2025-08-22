export interface Book {
  id: string;
  title: string;
  authors: string;
  genres: string;
  isbn: string;
  description: string;
  publishedDate: string;
  coverImage: string;
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