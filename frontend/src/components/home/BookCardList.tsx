import BookCard from './BookCard';
import { Book } from '@/types/book.type';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from '../ui/pagination';

interface BookCardListProps {
  books: Book[];
  pages?: number;
  currentPage?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onPageChange?: (page: number) => void; // Add this for direct page navigation
}

const BookCardList: React.FC<BookCardListProps> = ({
  books,
  pages = 1,
  currentPage = 1,
  onNextPage,
  onPrevPage,
  onPageChange,
}) => {
  // Safety check for books array
  if (!books || !Array.isArray(books)) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No books available</p>
      </div>
    );
  }

  // Handle pagination logic
  const totalPages = Math.ceil(pages);
  const showPagination = totalPages > 1;

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 3 pages
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  const handlePageClick = (page: number): void => {
    if (
      onPageChange &&
      page !== currentPage &&
      page >= 1 &&
      page <= totalPages
    ) {
      onPageChange(page);
    }
  };

  const handlePrevious = (): void => {
    if (onPrevPage && currentPage > 1) {
      onPrevPage();
    }
  };

  const handleNext = (): void => {
    if (onNextPage && currentPage < totalPages) {
      onNextPage();
    }
  };

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
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  handlePrevious();
                }}
                className={
                  currentPage <= 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageClick(pageNum as number);
                    }}
                    isActive={pageNum === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  handleNext();
                }}
                className={
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default BookCardList;
