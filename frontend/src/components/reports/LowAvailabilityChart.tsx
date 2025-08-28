'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookAvailability } from '@/types/reports.type';
import { AlertTriangleIcon } from 'lucide-react';

interface LowAvailabilityChartProps {
  books: BookAvailability[];
  loading: boolean;
  limit?: number;
}

export function LowAvailabilityChart({
  books,
  loading,
  limit = 5,
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
    if (percentage <= 10) return 'bg-red-500';
    if (percentage <= 25) return 'bg-orange-500';
    if (percentage <= 50) return 'bg-yellow-500';
    if (percentage <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getAvailabilityIconColor = (percentage: number) => {
    if (percentage <= 10) return 'text-red-500';
    if (percentage <= 25) return 'text-orange-500';
    if (percentage <= 50) return 'text-yellow-500';
    if (percentage <= 75) return 'text-blue-500';
    return 'text-green-500';
  };

  const getAvailabilityStatus = (percentage: number, availableCopies: number) => {
    if (availableCopies === 0) return 'Out of Stock';
    if (percentage <= 10) return 'Critical';
    if (percentage <= 25) return 'Low';
    if (percentage <= 50) return 'Moderate';
    return 'Good';
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
    if (rank === 1) return 'bg-red-500';
    if (rank === 2) return 'bg-orange-500';
    if (rank === 3) return 'bg-yellow-500';
    if (rank === 4) return 'bg-blue-500';
    return 'bg-green-500';
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
        <div className="h-[480px] overflow-y-auto space-y-4 pr-2">
          {books.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                All books have good availability
              </p>
            </div>
          ) : (
            books.slice(0, 10).map((book, index) => ( // Show up to 10 books in the list
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
                    <p className="text-xs text-gray-500">
                      Status: {getAvailabilityStatus(book.availability_percentage, book.availableCopies)}
                    </p>
                  </div>
                </div>
                <div className="ml-2 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {book.availability_percentage}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRankingLabel(index)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Top 5 Low Availability Books Chart */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Top 5 Low Availability Books
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Last 60 days - Lower percentage = More urgent attention needed
            </p>
          </div>
          
          {/* Chart Legend */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">📊 Chart Legend:</span>
              <span className="text-gray-500">Availability Status Guide</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>0% = Out of Stock (Critical)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>1-25% = Low Availability</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>26-50% = Moderate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>51%+ = Good Availability</span>
              </div>
            </div>
          </div>
          
          {top5Books.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                No low availability books found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {top5Books.map((book, index) => (
                <div key={book.bookId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {getRankingLabel(index)}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600 line-clamp-1 max-w-[200px]">
                        {book.title}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {book.availability_percentage}%
                      </span>
                      <div className="text-xs text-gray-500">
                        {book.availableCopies} of {book.quantity} copies
                      </div>
                    </div>
                  </div>
                  <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getRankingColor(index)} transition-all duration-300 ease-out`}
                      style={{
                        width: `${Math.min((book.availability_percentage / maxPercentage) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {/* Status indicator */}
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      book.availability_percentage === 0 
                        ? 'bg-red-100 text-red-700' 
                        : book.availability_percentage <= 25 
                        ? 'bg-orange-100 text-orange-700'
                        : book.availability_percentage <= 50 
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getAvailabilityStatus(book.availability_percentage, book.availableCopies)}
                    </span>
                    <span className="text-gray-500">
                      {book.availability_percentage === 0 
                        ? '🚨 Immediate action required' 
                        : book.availability_percentage <= 25 
                        ? '⚠️ Low stock warning'
                        : book.availability_percentage <= 50 
                        ? '📊 Monitor closely'
                        : '✅ Good availability'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
