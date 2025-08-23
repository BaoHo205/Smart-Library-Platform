'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBookByReadingTime } from '@/lib/types';

interface TopBooksByReadingTimeProps {
    books: TopBookByReadingTime[];
    loading: boolean;
    limit?: number;
}

export function TopBooksByReadingTime({ books, loading, limit = 10 }: TopBooksByReadingTimeProps) {
    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <Skeleton className="h-6 w-48 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-3"
                            >
                                <Skeleton className="h-4 w-8 rounded" />
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-4 w-12 rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatReadingTime = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${remainingMinutes}m`;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Top {limit} books by reading time
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
                {books.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-sm text-gray-500">
                            No reading data available
                        </p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style jsx>{`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10">
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left font-medium text-gray-700 px-4 py-3 w-16">
                                        Rank
                                    </TableHead>
                                    <TableHead className="text-left font-medium text-gray-700 px-4 py-3">
                                        Book Name
                                    </TableHead>
                                    <TableHead className="text-right font-medium text-gray-700 px-4 py-3 w-24">
                                        Time
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.slice(0, limit).map((book, index) => (
                                    <TableRow
                                        key={book.bookId}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            window.open(`/books/${book.bookId}`, '_blank');
                                        }}
                                    >
                                        <TableCell className="px-4 py-4 text-sm font-medium text-gray-900">
                                            #{index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            <div className="space-y-1">
                                                <p className="line-clamp-1 text-sm font-medium text-gray-900">
                                                    {book.title}
                                                </p>
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    by {book.author}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-right">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatReadingTime(book.totalReadingTime)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {book.totalSessions} sessions
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
