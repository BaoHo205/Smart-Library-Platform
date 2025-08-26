'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBookByReadingTime } from '@/types/reading-session.type';

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
                    {limit === 9999 ? 'Top All Books by Reading Time' : `Top ${limit} Books by Reading Time`}
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
                    <div className="space-y-0">
                        <style jsx>{`
                            .truncate {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 100%;
                            }
                            .min-w-0 {
                                min-width: 0;
                            }
                            table {
                                table-layout: fixed;
                            }
                            td, th {
                                word-wrap: break-word;
                                overflow-wrap: break-word;
                            }
                            .scrollable-body::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>

                        {/* Fixed Header Table */}
                        <Table className="table-fixed w-full border-separate border-spacing-0" style={{ tableLayout: 'fixed' }}>
                            <TableHeader>
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left font-medium text-gray-700 px-4 py-3 w-[15%] overflow-hidden bg-white">
                                        Rank
                                    </TableHead>
                                    <TableHead className="text-left font-medium text-gray-700 px-4 py-3 w-[65%] overflow-hidden bg-white">
                                        Book Name
                                    </TableHead>
                                    <TableHead className="text-right font-medium text-gray-700 px-4 py-3 w-[20%] overflow-hidden bg-white">
                                        Time
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>

                        {/* Scrollable Body Table */}
                        <div className="scrollable-body h-[370px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <Table className="table-fixed w-full border-separate border-spacing-0" style={{ tableLayout: 'fixed' }}>
                                <TableBody>
                                    {books.slice(0, limit === 9999 ? undefined : limit).map((book, index) => (
                                        <TableRow
                                            key={book.bookId}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => {
                                                window.open(`/books/${book.bookId}`, '_blank');
                                            }}
                                        >
                                            <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 w-[15%] overflow-hidden">
                                                #{index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 w-[65%] overflow-hidden">
                                                <div className="space-y-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate" title={book.title}>
                                                        {book.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate" title={`by ${book.author}`}>
                                                        by {book.author}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 text-right w-[20%] overflow-hidden">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatReadingTime(book.totalReadingTime)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
