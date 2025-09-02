'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserChip } from '@/components/ui/userchip';
import {
  MostBorrowedBooks,
  LowAvailabilityChart,
  TopActiveReaders,
  StaffReportsFilters,
  StaffBooksModal,
} from '@/components/reports';
import { useAuth } from '@/components/auth/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import {
  getMostBorrowedBooks,
  getBooksWithLowAvailability,
  getTopActiveReaders,
  getAllBooksForCategories,
} from '@/api/staffReports.api';
import {
  MostBorrowedBook,
  TopActiveReader,
  BookAvailability,
  StaffReportsFiltersState,
} from '@/types/reports.type';

// Helper function to calculate date range based on months back
const calculateDateRange = (monthsBack: number | 'all') => {
  if (monthsBack === 'all') {
    // For all-time, return empty strings (will be handled by API)
    return {
      startDate: '',
      endDate: '',
    };
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export default function StaffReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Calculate initial date range for last 6 months
  const initialDateRange = calculateDateRange(6);

  const [filters, setFilters] = useState<StaffReportsFiltersState>({
    startDate: initialDateRange.startDate,
    endDate: initialDateRange.endDate,
    monthsBack: 6,
    lowAvailabilityLimit: 5,
    mostBorrowedLimit: 5,
    topReadersLimit: 10,
  });

  const [mostBorrowedLoading, setMostBorrowedLoading] = useState(true);
  const [lowAvailabilityLoading, setLowAvailabilityLoading] = useState(true);
  const [topReadersLoading, setTopReadersLoading] = useState(true);

  const [mostBorrowedBooks, setMostBorrowedBooks] = useState<
    MostBorrowedBook[]
  >([]);
  const [lowAvailabilityBooks, setLowAvailabilityBooks] = useState<
    BookAvailability[]
  >([]);
  const [allBooksForCategories, setAllBooksForCategories] = useState<
    BookAvailability[]
  >([]);
  const [topActiveReaders, setTopActiveReaders] = useState<TopActiveReader[]>(
    []
  );

  const [showAllBooksModal, setShowAllBooksModal] = useState(false);

  const debouncedFilters = useDebounce(filters, 300);

  const [error, setError] = useState<string | null>(null);

  const handleBookClick = (bookId: string) => {
    window.open(`/books/${bookId}`, '_blank');
  };

  const fetchReports = useCallback(async () => {
    try {
      setError(null);
      setMostBorrowedLoading(true);
      setLowAvailabilityLoading(true);
      setTopReadersLoading(true);

      const [
        mostBorrowedData,
        lowAvailabilityData,
        allBooksData,
        topReadersData,
      ] = await Promise.all([
        getMostBorrowedBooks(
          debouncedFilters.startDate,
          debouncedFilters.endDate,
          debouncedFilters.mostBorrowedLimit,
          debouncedFilters.monthsBack === 'all'
        ),
        getBooksWithLowAvailability(debouncedFilters.lowAvailabilityLimit),
        getAllBooksForCategories(),
        getTopActiveReaders(
          debouncedFilters.monthsBack === 'all' ? 999 : debouncedFilters.monthsBack,
          debouncedFilters.topReadersLimit
        ),
      ]);

      setMostBorrowedBooks(mostBorrowedData);
      setLowAvailabilityBooks(lowAvailabilityData);
      setAllBooksForCategories(allBooksData);
      setTopActiveReaders(topReadersData);
    } catch (error) {
      console.error('Failed to load staff reports data:', error);
      setError('Failed to load staff reports data. Please try again.');
    } finally {
      setMostBorrowedLoading(false);
      setLowAvailabilityLoading(false);
      setTopReadersLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    if (!user) return;
    fetchReports();
  }, [user, fetchReports]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<StaffReportsFiltersState>) => {
      setFilters(prev => {
        const updatedFilters = { ...prev, ...newFilters };

        // If monthsBack changed, recalculate the date range
        if (
          newFilters.monthsBack !== undefined &&
          newFilters.monthsBack !== prev.monthsBack
        ) {
          const newDateRange = calculateDateRange(newFilters.monthsBack);
          updatedFilters.startDate = newDateRange.startDate;
          updatedFilters.endDate = newDateRange.endDate;
        }

        return updatedFilters;
      });
    },
    []
  );

  const handleShowAllBooks = () => {
    setShowAllBooksModal(true);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role !== 'staff') {
    router.push('/');
    return null;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Error Loading Reports
          </h1>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
              <p className="mt-1 text-sm text-gray-600">
                Monitor library performance and user engagement
              </p>
            </div>
            <UserChip user={user} loading={authLoading} />
          </div>
        </div>

        <StaffReportsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={false}
        />

        <div className="space-y-8">
          <MostBorrowedBooks
            books={mostBorrowedBooks}
            loading={mostBorrowedLoading}
            onBookClick={handleBookClick}
            limit={filters.mostBorrowedLimit}
            onShowAll={handleShowAllBooks}
            startDate={filters.startDate}
            endDate={filters.endDate}
          />

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="h-full xl:col-span-7">
              <LowAvailabilityChart
                books={lowAvailabilityBooks}
                allBooksForCategories={allBooksForCategories}
                loading={lowAvailabilityLoading}
              />
            </div>

            <div className="h-full xl:col-span-5">
              <TopActiveReaders
                readers={topActiveReaders}
                loading={topReadersLoading}
                limit={filters.topReadersLimit}
              />
            </div>
          </div>
        </div>

        <StaffBooksModal
          books={mostBorrowedBooks}
          isOpen={showAllBooksModal}
          onClose={() => setShowAllBooksModal(false)}
          onBookClick={handleBookClick}
          title={`All ${mostBorrowedBooks.length} Most Borrowed Books`}
        />
      </div>
    </div>
  );
}
