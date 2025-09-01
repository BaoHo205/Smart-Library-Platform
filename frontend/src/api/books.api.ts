import axiosInstance from '@/config/axiosConfig';
import type { BookDetails, IReview } from '@/types/book.type';

import type { GetAllBooksResponse } from '@/types/book.type';

// List
export const getAllBooks = async (
  currentGenre: string,
  currentPage: number,
  searchParam: string,
  searchInput: string
): Promise<GetAllBooksResponse> => {
  const response = await axiosInstance.get(
    `api/v1/books?pageSize=12&page=${currentPage}&genre=${currentGenre}&${searchParam}=${searchInput}`
  );
  return response.data.data || [];
};

// Details
export const getBookInfoById = async (bookId: string): Promise<BookDetails> => {
  const response = await axiosInstance.get(`/api/v1/books/${bookId}`);
  return response.data.data as BookDetails;
};

// Reviews
export const getReviewsByBookId = async (
  bookId: string
): Promise<IReview[]> => {
  const response = await axiosInstance.get(`/api/v1/books/${bookId}/reviews`);
  return response.data.data as IReview[];
};

// export const addReview = async (
//     bookId: string,
//     rating: number,
//     comment: string
// ): Promise<IReview> => {
//     const response = await axiosInstance.post('/api/v1/user/reviews/add', {
//         bookId,
//         rating,
//         comment,
//     });
//     return response.data.data as IReview;
// };

// export const updateReview = async (
//     reviewId: string,
//     rating: number,
//     comment: string
// ): Promise<IReview> => {
//     const response = await axiosInstance.put(`/api/v1/user/reviews/update/${reviewId}`, {
//         rating,
//         comment,
//     });
//     return response.data.data as IReview;
// };

export const reviewBook = async (
  bookId: string,
  rating: number,
  comment: string
): Promise<IReview> => {
  const response = await axiosInstance.post(`/api/v1/user/reviewBook`, {
    bookId,
    rating,
    comment,
  });
  return response.data.data as IReview;
};

// Borrow status
export const isBookBorrowed = async (bookId: string): Promise<boolean> => {
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
