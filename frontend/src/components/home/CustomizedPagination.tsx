'use client';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from '../ui/pagination';
import { useSearchParams } from 'next/navigation';

interface CustomizedPaginationProps {
  pages?: number;
  updateParams: (updates: Record<string, string | number | null>) => void;
}

const CustomizedPagination: React.FC<CustomizedPaginationProps> = ({
  pages = 1,
  updateParams,
}) => {
  const searchParams = useSearchParams();
  const [currentPageState, setCurrentPageState] = useState<number>(
    Number(searchParams.get('page') ?? 1)
  );

  // Handle pagination logic
  const totalPages = Math.max(1, Math.floor(pages));
  const currentPage = Number(searchParams.get('page') ?? currentPageState ?? 1);

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

  const onNextPage = (): void => {
    if (currentPage < totalPages) {
      updateParams({ page: currentPage + 1 });
      setCurrentPageState(currentPage + 1);
    }
  };

  const onPrevPage = (): void => {
    if (currentPage > 1) {
      updateParams({ page: currentPage - 1 });
      setCurrentPageState(currentPage - 1);
    }
  };

  const onPageChange = (page: number): void => {
    updateParams({ page });
    setCurrentPageState(page);
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
                  handlePageClick(Number(pageNum));
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
  );
};

export default CustomizedPagination;
