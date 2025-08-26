'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
// import { AverageSessionChart } from './AverageSessionChart';
import { BookAvailability, ReadingTrend } from '@/lib/types';
import { AlertTriangleIcon } from 'lucide-react';

interface LowAvailabilityProps {
  books: BookAvailability[];
  chartData: ReadingTrend[];
  loading: boolean;
  dailyAverage: number;
}

export function LowAvailability({
  books,
  chartData,
  loading,
  dailyAverage,
}: LowAvailabilityProps) {
  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Low availability books skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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

          {/* Chart skeleton */}
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

  const getAvailabilityIconColor = (percentage: number) => {
    if (percentage <= 20) return 'text-red-500';
    if (percentage <= 40) return 'text-orange-500';
    if (percentage <= 60) return 'text-yellow-500';
    if (percentage <= 80) return 'text-blue-500';
    return 'text-green-500';
  };

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
            books.slice(0, 5).map((book, index) => (
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
                <Badge
                  variant={
                    book.availability_percentage === 0
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="ml-2"
                >
                  {book.availability_percentage}%
                </Badge>
              </div>
            ))
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Average Session Time Chart */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Average Session Time
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {dailyAverage} minutes/day
            </p>
          </div>
          {/* <AverageSessionChart data={chartData} /> */}
        </div>
      </CardContent>
    </Card>
  );
}
