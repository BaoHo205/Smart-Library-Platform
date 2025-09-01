'use client';

import BookCard from './BookCard';
import { Book } from '@/types/book.type';
import CustomizedPagination from './CustomizedPagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface BookCardListProps {
  books: Book[];
  pages?: number;
  updateParams?: (updates: Record<string, string | number | null>) => void;
}

const BookCardList: React.FC<BookCardListProps> = ({
  books,
  pages = 1,
  updateParams
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const internalUpdateParams = (updates: Record<string, string | number | null>) => {
    if (updateParams) return updateParams(updates);
    // fallback: update URL using router
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k);
      else params.set(k, String(v));
    });
    const q = params.toString();
    const url = q ? `?${q}` : '/';
    router.push(url);
  };

  console.log(books);

  // Safety check for books array
  if (!books || !Array.isArray(books)) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No books available</p>
      </div>
    );
  }

  // Handle pagination logic
  const totalPages = Math.floor(pages);
  const showPagination = totalPages > 1;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.length > 0 ? (
          books.map(book => <BookCard key={book.id} {...book} />)
        ) : (
          <div className="col-span-full py-8 text-center">
            <p className="text-gray-500">No books found</p>
          </div>
        )}
      </div>

      {showPagination && (
        <CustomizedPagination pages={pages} updateParams={internalUpdateParams} />
      )}
    </>
  );
};

export default BookCardList;
