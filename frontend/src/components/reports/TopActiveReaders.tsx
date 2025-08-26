'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TopActiveReader } from '@/types/reports.type';
import { UsersIcon, CalendarIcon } from 'lucide-react';

interface TopActiveReadersProps {
    readers: TopActiveReader[];
    loading: boolean;
    limit?: number;
}

export function TopActiveReaders({ readers, loading, limit = 10 }: TopActiveReadersProps) {
    if (loading) {
        return (
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        Top Active Readers
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24 rounded" />
                                    <Skeleton className="h-3 w-16 rounded" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    ))}
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

    const getRankingColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 2:
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 3:
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Top Active Readers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {readers.length === 0 ? (
                        <div className="py-8 text-center">
                            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                                No reader data available
                            </p>
                        </div>
                    ) : (
                        readers.slice(0, limit).map((reader, index) => (
                            <div
                                key={`${reader.reader_name}-${index}`}
                                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                        <span className="text-sm font-medium text-gray-600">
                                            #{String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                            {reader.reader_name}
                                        </h4>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>Last: {formatDate(reader.last_checkout_date)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${getRankingColor(index + 1)} border`}
                                >
                                    {reader.total_checkouts.toLocaleString()} checkouts
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
