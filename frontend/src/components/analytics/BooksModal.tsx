'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MostHighlightedBook } from '@/types/reading-session.type';

interface BooksModalProps {
  books: MostHighlightedBook[];
  isOpen: boolean;
  onClose: () => void;
  onBookClick: (bookId: string) => void;
  title: string;
}

export function BooksModal({
  books,
  isOpen,
  onClose,
  onBookClick,
  title,
}: BooksModalProps) {
  const handleBookClick = (bookId: string) => {
    const book = books.find(b => b.bookId === bookId);
    if (book) {
      window.open(`/books/${book.bookId}`, '_blank');
    }
    onBookClick(bookId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[95vh] p-6"
        style={{
          maxWidth: '98vw',
          width: '98vw',
          minWidth: '98vw',
        }}
      >
        <DialogHeader>
          <DialogTitle className="mb-6 text-center text-2xl font-bold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="h-[80vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((book, index) => (
              <Card
                key={book.bookId}
                className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white shadow-md shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50"
                onClick={() => handleBookClick(book.bookId)}
              >
                <CardContent className="p-0">
                  <div className="flex h-full flex-col">
                    <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="absolute top-3 left-3 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-gray-900 px-2 py-1 text-xs font-bold text-white shadow-md"
                        >
                          #{index + 1}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="outline"
                          className="border-gray-300 bg-white/90 px-2 py-1 text-xs font-semibold text-gray-700 shadow-md backdrop-blur-sm"
                        >
                          {book.totalHighlights.toLocaleString()}
                        </Badge>
                      </div>

                      <div className="flex h-full w-full items-center justify-center border-b border-gray-100 p-2">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="p-4 text-center">
                            <div className="mb-2 text-3xl font-bold text-gray-300">
                              📚
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                              No Cover
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="line-clamp-2 text-sm leading-tight font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                              {book.title}
                            </h3>
                            <p className="line-clamp-1 text-xs font-medium text-gray-600">
                              by {book.author}
                            </p>
                          </div>
                          <div className="relative ml-2 flex-shrink-0">
                            <div className="group/question rounded-full p-1 transition-colors duration-200 hover:bg-gray-100">
                              <svg
                                className="h-4 w-4 cursor-help text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div className="pointer-events-none absolute right-0 bottom-full z-[99999] mb-2 w-64 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover/question:opacity-100">
                                <div className="text-left leading-relaxed">
                                  <p className="mb-2 font-medium">
                                    Metrics Explanation
                                  </p>
                                  <p className="mb-1 text-gray-200">
                                    <strong>Readers:</strong> Unique users who
                                    read this book
                                  </p>
                                  <p className="mb-1 text-gray-200">
                                    <strong>Sessions:</strong> Total reading
                                    sessions for this book
                                  </p>
                                  <p className="text-gray-200">
                                    <strong>/session:</strong> Average
                                    highlights per reading session
                                  </p>
                                </div>
                                <div className="absolute top-full right-4 h-0 w-0 border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                          <div className="text-sm font-bold text-gray-900">
                            {book.uniqueReadersCount}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            Readers
                          </div>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                          <div className="text-sm font-bold text-gray-900">
                            {book.totalSessions}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            Sessions
                          </div>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                          <div className="text-sm font-bold text-gray-900">
                            {(book.avgHighlightsPerSession ?? 0).toFixed(1)}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            /session
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
