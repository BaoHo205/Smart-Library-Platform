'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserChip } from '@/components/ui/userchip';
import {
    MostBorrowedBooks,
    LowAvailabilityChart,
    TopActiveReaders,
    StaffReportsFilters,
    StaffBooksModal
} from '@/components/reports';
import { useAuth } from '@/components/auth/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/api/api';
import {
    MostBorrowedBook,
    TopActiveReader,
    BookAvailability,
    StaffReportsFiltersState,
} from '@/lib/types';

export default function StaffReportsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [filters, setFilters] = useState<StaffReportsFiltersState>({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        endDate: new Date().toISOString().split('T')[0], // today
        monthsBack: 6,
        interval: 60,
        mostBorrowedLimit: 5,
        topReadersLimit: 10,
    });

    const [mostBorrowedLoading, setMostBorrowedLoading] = useState(true);
    const [lowAvailabilityLoading, setLowAvailabilityLoading] = useState(true);
    const [topReadersLoading, setTopReadersLoading] = useState(true);

    const [mostBorrowedBooks, setMostBorrowedBooks] = useState<MostBorrowedBook[]>([]);
    const [lowAvailabilityBooks, setLowAvailabilityBooks] = useState<BookAvailability[]>([]);
    const [topActiveReaders, setTopActiveReaders] = useState<TopActiveReader[]>([]);

    const [showAllBooksModal, setShowAllBooksModal] = useState(false);

    const debouncedFilters = useDebounce(filters, 300);

    const initialLoadComplete = useRef(false);

    const [error, setError] = useState<string | null>(null);

    const handleBookClick = (bookId: string) => {
        window.open(`/books/${bookId}`, '_blank');
    };

    useEffect(() => {
        if (!user || initialLoadComplete.current) return;

        const loadInitialData = async () => {
            try {
                setError(null);
                setMostBorrowedLoading(true);
                setLowAvailabilityLoading(true);
                setTopReadersLoading(true);

                console.log('Fetching data with filters:', filters);

                const [mostBorrowedData, lowAvailabilityData, topReadersData] = await Promise.all([
                    api.getMostBorrowedBooks(filters.startDate, filters.endDate, filters.mostBorrowedLimit),
                    api.getBooksWithLowAvailability(filters.interval),
                    api.getTopActiveReaders(filters.monthsBack, filters.topReadersLimit)
                ]);

                console.log('Data fetched:', { mostBorrowedData, lowAvailabilityData, topReadersData });

                setMostBorrowedBooks(mostBorrowedData);
                setLowAvailabilityBooks(lowAvailabilityData);
                setTopActiveReaders(topReadersData);

                initialLoadComplete.current = true;
            } catch (error) {
                console.error('Failed to load initial staff reports data:', error);
                setError('Failed to load staff reports data. Please try again.');
            } finally {
                setMostBorrowedLoading(false);
                setLowAvailabilityLoading(false);
                setTopReadersLoading(false);
            }
        };

        loadInitialData();
    }, [user]);

    // Handle filter changes - reload data when filters change
    useEffect(() => {
        if (!user || !initialLoadComplete.current) return;

        const loadFilteredData = async () => {
            try {
                setError(null);
                setMostBorrowedLoading(true);
                setLowAvailabilityLoading(true);
                setTopReadersLoading(true);

                const [mostBorrowedData, lowAvailabilityData, topReadersData] = await Promise.all([
                    api.getMostBorrowedBooks(filters.startDate, filters.endDate, filters.mostBorrowedLimit),
                    api.getBooksWithLowAvailability(filters.interval),
                    api.getTopActiveReaders(filters.monthsBack, filters.topReadersLimit)
                ]);

                setMostBorrowedBooks(mostBorrowedData);
                setLowAvailabilityBooks(lowAvailabilityData);
                setTopActiveReaders(topReadersData);
            } catch (error) {
                console.error('Failed to load filtered staff reports data:', error);
                setError('Failed to update staff reports data. Please try again.');
            } finally {
                setMostBorrowedLoading(false);
                setLowAvailabilityLoading(false);
                setTopReadersLoading(false);
            }
        };

        loadFilteredData();
    }, [debouncedFilters, user]);

    const handleFiltersChange = useCallback((newFilters: Partial<StaffReportsFiltersState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const handleShowAllBooks = () => {
        setShowAllBooksModal(true);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Reports</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                                My Reports
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
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
                        <div className="xl:col-span-7">
                            <LowAvailabilityChart
                                books={lowAvailabilityBooks}
                                loading={lowAvailabilityLoading}
                                interval={filters.interval}
                            />
                        </div>

                        <div className="xl:col-span-5">
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
