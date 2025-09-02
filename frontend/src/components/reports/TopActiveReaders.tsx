'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TopActiveReader } from '@/types/reports.type';
import { CalendarIcon } from 'lucide-react';

interface TopActiveReadersProps {
  readers: TopActiveReader[];
  loading: boolean;
  limit?: number | 'max';
}

export function TopActiveReaders({
  readers,
  loading,
  limit = 10,
}: TopActiveReadersProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Top Active Readers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: typeof limit === 'number' ? limit : 10 }).map(
            (_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            )
          )}
        </CardContent>
      </Card>
    );
  }

  const readersToShow = limit === 'max' ? readers : readers.slice(0, limit);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top Active Readers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-2">
          {readers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No active readers found</p>
            </div>
          ) : (
            readersToShow.map((reader, index) => (
              <div
                key={reader.reader_name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                    #{String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {reader.reader_name}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3" />
                      <span>
                        Last:{' '}
                        {new Date(reader.last_checkout_date).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {reader.total_checkouts} checkouts
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
