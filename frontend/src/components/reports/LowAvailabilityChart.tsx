'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookAvailability } from '@/types/reports.type';
import { AlertTriangleIcon } from 'lucide-react';

interface LowAvailabilityChartProps {
  books: BookAvailability[];
  loading: boolean;
  interval: number;
}

export function LowAvailabilityChart({
  books,
  loading,
  interval,
}: LowAvailabilityChartProps) {
  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
            <Skeleton className="h-32 w-full rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAvailabilityColor = (percentage: number) => {
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 40) return 'bg-orange-500';
    if (percentage <= 60) return 'bg-yellow-500';
    if (percentage <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getAvailabilityIconColor = (percentage: number) => {
    if (percentage <= 20) return 'text-red-500';
    if (percentage <= 40) return 'text-orange-500';
    if (percentage <= 60) return 'text-yellow-500';
    if (percentage <= 80) return 'text-blue-500';
    return 'text-green-500';
  };

  const getRankingLabel = (index: number) => {
    const rank = index + 1;
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
  };

  const getRankingColor = (index: number) => {
    const rank = index + 1;
    if (rank === 1) return 'bg-orange-500';
    if (rank === 2) return 'bg-teal-500';
    if (rank === 3) return 'bg-blue-600';
    if (rank === 4) return 'bg-yellow-500';
    return 'bg-orange-400';
  };

  const top5Books = books.slice(0, 5);
  const maxPercentage = Math.max(
    ...top5Books.map(book => book.availability_percentage),
    100
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Books with Low Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Low availability books list */}
        <div className="space-y-4">
          {books.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                All books have good availability
              </p>
            </div>
          ) : (
            top5Books.map((book, index) => (
              <div
                key={book.bookId}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangleIcon
                    className={`h-4 w-4 ${getAvailabilityIconColor(book.availability_percentage)}`}
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="line-clamp-1 text-sm font-medium text-gray-900">
                      {book.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {book.availableCopies} of {book.quantity} available
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {book.availability_percentage}%
                  </div>
                  <div className="text-xs text-gray-500">Unavailability</div>
                </div>
              </div>
            ))
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Bar Chart */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Top 5 Low Availability Books
            </h3>
            <p className="mt-1 text-xs text-gray-500">Last {interval} days</p>
          </div>

          <div className="space-y-3">
            {top5Books.map((book, index) => (
              <div key={`${book.title}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700">
                    {getRankingLabel(index)}
                  </span>
                  <span className="text-gray-500">
                    {book.availability_percentage}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getRankingColor(index)}`}
                    style={{
                      width: `${(book.availability_percentage / maxPercentage) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
