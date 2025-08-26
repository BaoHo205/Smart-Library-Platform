'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserChip } from '@/components/ui/userchip';
import { MostHighlightedBooks } from '@/components/analytics/MostHighlightedBooks';
import { AverageSessionChart } from '@/components/analytics/AverageSessionChart';
import { TopBooksByReadingTime } from '@/components/analytics/TopBooksByReadingTime';
import { BooksModal } from '@/components/analytics/BooksModal';
import { AnalyticsFilters as AnalyticsFiltersComponent } from '@/components/analytics/AnalyticsFilters';
import { useAuth } from '@/components/auth/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getMostHighlightedBooksWithDetails, getTopBooksByReadTimeWithDetails, getReadingTrends } from '@/api/readingSessions.api';
import {
    UserProfile,
    MostHighlightedBook,
    TopBookByReadingTime,
    ReadingTrend,
    AnalyticsFiltersState,
} from '@/types/reading-session.type';

export default function ReadingAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const isStaff = user?.role === 'staff';

  const [viewMode, setViewMode] = useState<'personal' | 'platform'>(
    isStaff ? 'platform' : 'personal'
  );

  // Clear userId filter when switching to personal mode
  const handleViewModeChange = (newViewMode: 'personal' | 'platform') => {
    setViewMode(newViewMode);
    if (newViewMode === 'personal') {
      // Clear userId filter when switching to personal mode
      setFilters(prev => ({ ...prev, userId: undefined }));
    }
  };

  const [filters, setFilters] = useState<AnalyticsFiltersState>({
    months: 6,
    deviceType: 'all',
    highlightedBooksLimit: 5,
    topBooksLimit: 10,
  });

  const [highlightedBooksLoading, setHighlightedBooksLoading] = useState(true);
  const [topBooksLoading, setTopBooksLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  const [highlightedBooks, setHighlightedBooks] = useState<
    MostHighlightedBook[]
  >([]);
  const [topBooks, setTopBooks] = useState<TopBookByReadingTime[]>([]);
  const [chartData, setChartData] = useState<ReadingTrend[]>([]);
  const [dailyAverage, setDailyAverage] = useState(30);

  const [showAllBooksModal, setShowAllBooksModal] = useState(false);

  const debouncedFilters = useDebounce(filters, 300);

  const initialLoadComplete = useRef(false);

  const [error, setError] = useState<string | null>(null);

  const handleBookClick = (bookId: string) => {
    window.open(`/books/${bookId}`, '_blank');
  };

  const fillMissingMonths = (
    data: ReadingTrend[],
    months: number | 'all',
    dateRange?: { from: Date | undefined; to: Date | undefined }
  ): ReadingTrend[] => {
    if (data.length === 0) {
      const filledData: ReadingTrend[] = [];
      let startDate: Date;
      let endDate: Date;

      if (dateRange?.from && dateRange?.to) {
        startDate = new Date(dateRange.from);
        endDate = new Date(dateRange.to);
      } else if (months === 'all') {
        // Max option - use a reasonable default range (last 12 months)
        const currentDate = new Date();
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 11,
          1
        );
        endDate = currentDate;
      } else {
        const currentDate = new Date();
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - (months as number) + 1,
          1
        );
        endDate = currentDate;
      }

      // Fill all months from start to end with zero values
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setMonth(d.getMonth() + 1)
      ) {
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        filledData.push({
          year,
          month,
          monthLabel: d.toLocaleDateString('en-US', { month: 'short' }),
          fullMonthLabel: d.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          totalSessions: 0,
          totalDuration: 0,
          avgDuration: 0,
          uniqueBooksCount: 0,
          uniqueUsersCount: 0,
        });
      }
      return filledData;
    }

    const filledData: ReadingTrend[] = [];
    let startDate: Date;
    let endDate: Date;

    if (dateRange?.from && dateRange?.to) {
      startDate = new Date(dateRange.from);
      endDate = new Date(dateRange.to);
    } else if (months === 'all') {
      if (data.length === 0) return data;

      const sortedData = [...data].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      const firstEntry = sortedData[0];
      const lastEntry = sortedData[sortedData.length - 1];

      startDate = new Date(firstEntry.year, firstEntry.month - 1, 1);
      endDate = new Date(lastEntry.year, lastEntry.month - 1, 1);
    } else {
      // Use months back from current date, not from the data
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - (months as number) + 1,
        1
      );
      endDate = currentDate;
    }

    const dataMap = new Map<string, ReadingTrend>();
    data.forEach(item => {
      const key = `${item.year}-${item.month}`;
      dataMap.set(key, item);
    });

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${month}`;

      if (dataMap.has(key)) {
        filledData.push(dataMap.get(key)!);
      } else {
        filledData.push({
          year,
          month,
          monthLabel: d.toLocaleDateString('en-US', { month: 'short' }),
          fullMonthLabel: d.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          totalSessions: 0,
          totalDuration: 0,
          avgDuration: 0,
          uniqueBooksCount: 0,
          uniqueUsersCount: 0,
        });
      }
    }

    return filledData;
  };

  useEffect(() => {
    if (!user || initialLoadComplete.current) return;

    const loadInitialData = async () => {
      try {
        setError(null);
        setHighlightedBooksLoading(true);
        setTopBooksLoading(true);
        setChartLoading(true);

                const [highlightedBooksData, topBooksData, chartTrendsData] = await Promise.all([
                    getMostHighlightedBooksWithDetails(filters.highlightedBooksLimit),
                    getTopBooksByReadTimeWithDetails(filters.topBooksLimit),
                    getReadingTrends(
                        viewMode === 'personal' ? user.id : undefined,
                        filters.months === 'all' ? 'all' : filters.months,
                        filters.dateRange
                    )
                ]);

        console.log('API Response Data:', {
          highlightedBooks: highlightedBooksData,
          topBooks: topBooksData,
          chartTrends: chartTrendsData,
          filters,
          viewMode,
          userId: viewMode === 'personal' ? user.id : undefined,
        });

        const filledChartData = fillMissingMonths(
          chartTrendsData,
          filters.months,
          filters.dateRange
        );

        if (filledChartData.length > 0) {
          const totalDuration = filledChartData.reduce(
            (sum, trend) => sum + trend.totalDuration,
            0
          );
          const totalDays = filledChartData.length * 30;
          setDailyAverage(Math.round(totalDuration / totalDays));
        }

        setHighlightedBooks(highlightedBooksData);
        setTopBooks(topBooksData);
        setChartData(filledChartData);

        initialLoadComplete.current = true;
      } catch (error) {
        console.error('Failed to load initial reading analytics data:', error);
        setError('Failed to load reading analytics data. Please try again.');
      } finally {
        setHighlightedBooksLoading(false);
        setTopBooksLoading(false);
        setChartLoading(false);
      }
    };

    loadInitialData();
  }, [user, viewMode]);

  // Handle filter changes - reload data when filters change
  useEffect(() => {
    if (!user || !initialLoadComplete.current) return;

    const loadFilteredData = async () => {
      try {
        setError(null);
        setHighlightedBooksLoading(true);
        setTopBooksLoading(true);
        setChartLoading(true);

                const [highlightedBooksData, topBooksData, chartTrendsData] = await Promise.all([
                    getMostHighlightedBooksWithDetails(filters.highlightedBooksLimit),
                    getTopBooksByReadTimeWithDetails(filters.topBooksLimit),
                    getReadingTrends(
                        viewMode === 'personal' ? user.id : undefined,
                        filters.months === 'all' ? 'all' : filters.months,
                        filters.dateRange
                    )
                ]);

        console.log('API Response Data:', {
          highlightedBooks: highlightedBooksData,
          topBooks: topBooksData,
          chartTrends: chartTrendsData,
          filters,
          viewMode,
          userId: viewMode === 'personal' ? user.id : undefined,
        });

        const filledChartData = fillMissingMonths(
          chartTrendsData,
          filters.months,
          filters.dateRange
        );

        if (filledChartData.length > 0) {
          const totalDuration = filledChartData.reduce(
            (sum, trend) => sum + trend.totalDuration,
            0
          );
          const totalDays = filledChartData.length * 30;
          setDailyAverage(Math.round(totalDuration / totalDays));
        }

        setHighlightedBooks(highlightedBooksData);
        setTopBooks(topBooksData);
        setChartData(filledChartData);
      } catch (error) {
        console.error('Failed to load filtered reading analytics data:', error);
        setError('Failed to update reading analytics data. Please try again.');
      } finally {
        setHighlightedBooksLoading(false);
        setTopBooksLoading(false);
        setChartLoading(false);
      }
    };

    loadFilteredData();
  }, [debouncedFilters, viewMode, user]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<AnalyticsFiltersState>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleShowAllBooks = () => {
    setShowAllBooksModal(true);
  };

  const getPageTitle = () => {
    if (viewMode === 'personal') {
      return 'My Reading Analytics';
    }
    return 'Platform Reading Analytics';
  };

  const getPageSubtitle = () => {
    if (viewMode === 'personal') {
      return 'Track your personal reading habits and progress';
    }
    return 'Monitor overall platform reading engagement and trends';
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Error Loading Analytics
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
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{getPageSubtitle()}</p>
            </div>
            <UserChip user={user} loading={authLoading} />
          </div>

          {isStaff && (
            <div className="mt-4 flex w-fit items-center gap-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => handleViewModeChange('personal')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'personal'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Analytics
              </button>
              <button
                onClick={() => handleViewModeChange('platform')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'platform'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Platform Analytics
              </button>
            </div>
          )}
        </div>

        <AnalyticsFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={false}
          viewMode={viewMode}
        />

        <div className="space-y-8">
          <MostHighlightedBooks
            books={highlightedBooks}
            loading={highlightedBooksLoading}
            onBookClick={handleBookClick}
            limit={filters.highlightedBooksLimit}
            onShowAll={handleShowAllBooks}
          />

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <AverageSessionChart
                data={chartData}
                loading={chartLoading}
                dailyAverage={dailyAverage}
              />
            </div>

            <div className="xl:col-span-5">
              <TopBooksByReadingTime
                books={topBooks}
                loading={topBooksLoading}
                limit={filters.topBooksLimit}
              />
            </div>
          </div>
        </div>

        <BooksModal
          books={highlightedBooks}
          isOpen={showAllBooksModal}
          onClose={() => setShowAllBooksModal(false)}
          onBookClick={handleBookClick}
          title={`All ${highlightedBooks.length} Most Highlighted Books`}
        />
      </div>
    </div>
  );
}
