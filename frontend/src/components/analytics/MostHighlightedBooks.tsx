'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MostHighlightedBook } from '@/types/reading-session.type';

interface MostHighlightedBooksProps {
  books: MostHighlightedBook[];
  loading: boolean;
  onBookClick: (bookId: string) => void;
  limit?: number;
  onShowAll?: () => void;
}

export function MostHighlightedBooks({
  books,
  loading,
  onBookClick,
  limit = 5,
  onShowAll,
}: MostHighlightedBooksProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="relative">
              <CardContent className="p-4">
                <div className="absolute top-3 left-3 z-10">
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <Skeleton className="mb-3 aspect-[3/4] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {limit === 9999
            ? 'Top All Most Highlighted Books'
            : `Top ${limit} Most Highlighted Books`}
        </h2>
        {onShowAll && (
          <button
            onClick={onShowAll}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-900"
          >
            See All Details
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {books.slice(0, limit).map((book, index) => (
          <Card
            key={book.bookId}
            className="relative cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => {
              onBookClick(book.bookId);
              window.open(`/books/${book.bookId}`, '_blank');
            }}
          >
            <CardContent className="p-4">
              <div className="absolute top-3 left-3 z-10">
                <Badge
                  variant="secondary"
                  className="bg-gray-900 px-2 py-1 text-xs text-white"
                >
                  #Top {index + 1}
                </Badge>
              </div>

              <div className="absolute top-3 right-3 z-10">
                <Badge variant="outline" className="bg-white px-2 py-1 text-xs">
                  {book.totalHighlights.toLocaleString()}
                </Badge>
              </div>

              <div className="mt-8 mb-3 flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="p-4 text-center">
                    <div className="mb-1 text-2xl font-bold text-gray-400">
                      📚
                    </div>
                    <div className="text-xs text-gray-500">No Cover</div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="line-clamp-1 text-sm font-medium text-gray-900">
                  {book.title}
                </h3>
                <p className="line-clamp-1 text-xs text-gray-600">
                  {book.author}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
