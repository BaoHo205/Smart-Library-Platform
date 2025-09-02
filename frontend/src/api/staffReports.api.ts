import axiosInstance from '@/config/axiosConfig';
import type {
  MostBorrowedBook,
  BookAvailability,
  TopActiveReader,
} from '@/types/reports.type';

export const getMostBorrowedBooks = async (
  startDate?: string,
  endDate?: string,
  limit: number | 'max' = 5,
  allTime: boolean = false
): Promise<MostBorrowedBook[]> => {
  const limitParam = limit === 'max' ? 'max' : String(limit);

  // query parameters
  const params = new URLSearchParams();
  if (allTime) {
    params.append('allTime', 'true');
  } else {
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
  }
  params.append('limit', limitParam);

  const response = await axiosInstance.get(
    `/api/v1/staff/most-borrowed-books?${params.toString()}`
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
        } as MostBorrowedBook;
      } catch (error) {
        console.error(`Failed to fetch book details for ${book.title}:`, error);
        return {
          bookId: book.id || `book_${Date.now()}_${Math.random()}`,
          title: book.title || '',
          authors: book.authors || 'Unknown Author',
          total_checkouts: book.total_checkouts || 0,
          availableCopies: book.availableCopies || 0,
          quantity: book.quantity || 0,
          coverUrl: null,
        } as MostBorrowedBook;
      }
    })
  );
  return booksWithDetails;
};

export const getBooksWithLowAvailability = async (
  limit: number = 5
): Promise<BookAvailability[]> => {
  const response = await axiosInstance.get(
    `/api/v1/staff/low-availability?lowAvailabilityLimit=${limit}`
  );
  const books = response.data.data || [];
  return books.map((book: any) => ({
    bookId: book.id || `book_${Date.now()}_${Math.random()}`,
    title: book.title || '',
    availableCopies: book.availableCopies || 0,
    quantity: book.quantity || 0,
    availability_percentage: book.availability_percentage || 0,
    recent_checkouts: book.recent_checkouts || 0,
    coverUrl: null,
  }));
};

export const getAllBooksForCategories = async (): Promise<
  BookAvailability[]
> => {
  const response = await axiosInstance.get(
    `/api/v1/staff/low-availability?lowAvailabilityLimit=max`
  );
  const books = response.data.data || [];
  return books.map((book: any) => ({
    bookId: book.id || `book_${Date.now()}_${Math.random()}`,
    title: book.title || '',
    availableCopies: book.availableCopies || 0,
    quantity: book.quantity || 0,
    availability_percentage: book.availability_percentage || 0,
    recent_checkouts: book.recent_checkouts || 0,
    coverUrl: null,
  }));
};

export const getTopActiveReaders = async (
  monthsBack: number = 6,
  limit: number | 'max' = 10
): Promise<TopActiveReader[]> => {
  const limitParam = limit === 'max' ? 'max' : String(limit);
  const response = await axiosInstance.get(
    `/api/v1/staff/top-active-readers?monthsBack=${monthsBack}&limit=${limitParam}`
  );
  return response.data.data || [];
};

export const getBooksBorrowCountInRange = async (
  startDate: string,
  endDate: string
): Promise<number> => {
  const response = await axiosInstance.get(
    `/api/v1/staff/borrow-count?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
  );
  return response.data.data?.totalBorrowed;
};
