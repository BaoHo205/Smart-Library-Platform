'use client';

import { MapPin, Book, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { Review } from '@/types/book.type';
import { renderStars } from '../Star';

interface BookDetail {
  id: string;
  title: string;
  author: string;
  genre: string[];
  publisher: string;
  description: string;
  coverImage?: string;
  rating: number;
  totalReviews: number;
  offlineLocation?: string;
  availableCopies: number;
}

interface BookDetailProps {
  book: BookDetail;
  reviews: Review[] | null;
  onBorrow: () => void;
  borrowing: boolean;
  isBorrowed: boolean;
}

export default function BookDetail({
  book,
  reviews,
  onBorrow,
  borrowing,
  isBorrowed,
}: BookDetailProps) {
  const calculateAvgRating = () => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((totalRating / reviews.length).toFixed(1));
  };

  // Get the average rating
  const avgRating = calculateAvgRating();
  const totalReviews = reviews ? reviews.length : 0;

  return (
    <div className="space-y-8">
      {/* Book Header */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Book Cover */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-lg bg-gray-200 shadow-lg">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  priority={true}
                  onError={() => {
                    console.log('Failed to load book cover image');
                  }}
                />
              ) : (
                <div className="flex h-full min-h-[400px] w-full items-center justify-center">
                  <Book className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="flex min-h-[400px] flex-col justify-between md:col-span-2">
          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {book.title}
              </h1>

              <div className="mb-4 flex items-center gap-2">
                {renderStars(avgRating)}
                <span className="text-gray-600">
                  ({totalReviews} customer{' '}
                  {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Author: </span>
                  <span className="text-gray-600">{book.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Genre: </span>
                  <div className="flex gap-2">
                    {book.genre.map((g, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">
                    Publisher:{' '}
                  </span>
                  <span className="text-gray-600">{book.publisher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">
                    Offline Available
                  </span>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    Beanland Library
                  </span>
                </div>
                {book.availableCopies > 0 ? (
                  <div className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-semibold text-black">
                    {`${book.availableCopies} ${book.availableCopies === 1 ? 'copy' : 'copies'} available`}
                  </div>
                ) : (
                  <div className="inline-block rounded-lg border-2 border-red-500 bg-white px-3 py-1 text-sm font-semibold text-red-600">
                    Out of stock
                  </div>
                )}

              </div>
            </div>
          </div>

          <div className="mt-6">
            {isBorrowed ? (
              <Button
                className="cursor-not-allowed bg-slate-600 hover:bg-slate-600"
                disabled={true}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Borrowed
              </Button>
            ) : (
              <Button
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                onClick={onBorrow}
                disabled={borrowing}
              >
                <Book className="mr-2 h-4 w-4" />
                {borrowing ? 'Borrowing...' : 'Borrow'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Description</h2>
        <div className="space-y-4 leading-relaxed text-gray-700">
          {book.description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
