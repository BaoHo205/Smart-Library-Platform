'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MostBorrowedBook } from '@/lib/types';
import { CalendarIcon, BookOpenIcon } from 'lucide-react';

interface MostBorrowedBooksProps {
    books: MostBorrowedBook[];
    loading: boolean;
    onBookClick: (bookId: string) => void;
    limit?: number;
    onShowAll?: () => void;
    startDate: string;
    endDate: string;
}

export function MostBorrowedBooks({
    books,
    loading,
    onBookClick,
    limit = 5,
    onShowAll,
    startDate,
    endDate
}: MostBorrowedBooksProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        Most Borrowed Books
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-4 w-4 rounded" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Array.from({ length: limit }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-3 w-3/4 rounded" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Most Borrowed Books
                </CardTitle>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
                    </div>
                    {onShowAll && (
                        <button
                            onClick={onShowAll}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Show all
                        </button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {books.slice(0, limit).map((book, index) => (
                        <div
                            key={book.bookId}
                            className="group cursor-pointer space-y-3"
                            onClick={() => onBookClick(book.bookId)}
                        >
                            <div className="relative">
                                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
                                    {book.coverUrl ? (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <BookOpenIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <Badge
                                    className="absolute top-2 left-2 bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    #{index + 1}
                                </Badge>
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                                    <BookOpenIcon className="h-4 w-4 text-gray-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                    by {book.authors}
                                </p>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="text-xs">
                                        {book.total_checkouts.toLocaleString()} checkouts
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {book.availableCopies}/{book.quantity} available
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
