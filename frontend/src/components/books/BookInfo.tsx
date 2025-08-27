'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookDetail from '@/components/books/BookDetail';
import BookReviews from '@/components/books/BookReviews';
import { getBookInfoById, getReviewsByBookId, addReview, updateReview, isBookBorrowed } from '@/api/books.api';
import { borrowBook } from '@/api/checkout.api';
import type { BookDetails, IReview } from '@/types/book.type';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/useAuth';

// Interface to match BookDetail component props
interface BookDetailType {
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

// Interface to match Review component props
export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  // userAvatar?: string
  name: string;
}

// Adapter function to convert BookDetails to BookDetailType
const adaptBookDetails = (book: BookDetails): BookDetailType => {
  return {
    id: book.id,
    title: book.title,
    author: book.authors.join(', '),
    genre: book.genres,
    publisher: book.publisherName,
    description: book.description || 'No description available',
    coverImage: book.thumbnailUrl || undefined,
    rating: book.avgRating,
    totalReviews: book.numberOfRatings,
    offlineLocation: undefined, // We don't have this in the API
    availableCopies: book.availableCopies || 0, // Default to 0 if not provided
  };
};

const adaptReview = (review: IReview): Review => {
  return {
    id: review.id,
    userId: review.userId,
    bookId: review.bookId,
    rating: review.rating,
    comment: review.comment || '',
    createdAt: review.createdAt.toString(),
    updatedAt: review.updatedAt.toString(),
    userName: review.name || review.userName,
    name: review.name,
  };
};

// // Helper function to generate due date (2 weeks from now)
// const generateDueDate = (): string => {
//   const today = new Date();
//   const dueDate = new Date(today);
//   dueDate.setDate(today.getDate() + 14); // 2 weeks from now
//   return dueDate.toISOString().split('T')[0];
// };

interface BookDetailPageProps {
  bookId: string;
}

export default function BookInfoPage({
  bookId = '0418ba35-d180-4c9c-8cca-b9b41a46e65e',
}: BookDetailPageProps) {
  const { user } = useAuth(); // User is guaranteed to be authenticated
  const [book, setBook] = useState<BookDetailType | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [borrowing, setBorrowing] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);

  const fetchBookData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch book details
      const bookResponse = await getBookInfoById(bookId);
      setBook(adaptBookDetails(bookResponse));

      // Check if the book is already borrowed by this user
      const borrowStatus = await isBookBorrowed(bookId);
      setIsBorrowed(borrowStatus);

      // Fetch reviews
      const reviewsResponse = await getReviewsByBookId(bookId);
      setReviews(reviewsResponse.map(adaptReview));

      // Check if current user has already borrowed this book
      // You might need to add this API call or check from the book response
      // For now, we'll assume the book response includes this information
      // setIsBorrowed(bookResponse.isBorrowedByCurrentUser || false)
    } catch (err) {
      setError(
        'Failed to fetch book data. Please check the book ID and try again.'
      );
      console.error('Error fetching book data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  const handleBorrow = async () => {
    if (borrowing) return;

    setBorrowing(true);
    try {
      const result = await borrowBook(bookId);
      if (result.success) {
        setIsBorrowed(true);
        toast.success('Book borrowed successfully!');
      } else {
        toast.error(result.message || 'Failed to borrow book');
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      setError('Failed to borrow book. Please try again.');
    } finally {
      setBorrowing(false);
    }
  };

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      await addReview(bookId, rating, comment);

      // Refresh data to show new review and updated rating
      const [updatedBookInfo, updatedReviews] = await Promise.all([
        getBookInfoById(bookId),
        getReviewsByBookId(bookId),
      ]);

      setBook(adaptBookDetails(updatedBookInfo));
      setReviews(updatedReviews.map(adaptReview));
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review. Please try again.');
    }
  };

  const handleUpdateReview = async (
    reviewId: string,
    rating: number,
    comment: string
  ) => {
    try {
      await updateReview(reviewId, rating, comment);

      // Refresh data to show updated review and rating
      const [updatedBookInfo, updatedReviews] = await Promise.all([
        getBookInfoById(bookId),
        getReviewsByBookId(bookId),
      ]);

      setBook(adaptBookDetails(updatedBookInfo));
      setReviews(updatedReviews.map(adaptReview));
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update review. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="animate-pulse">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="aspect-[3/4] rounded-lg bg-gray-200"></div>
            <div className="space-y-4 md:col-span-2">
              <div className="h-8 rounded bg-gray-200"></div>
              <div className="h-6 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">{error || 'Book not found'}</p>
            <Button onClick={fetchBookData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-6">
      {/* Book Detail Section */}
      <BookDetail
        book={book}
        reviews={reviews}
        onBorrow={handleBorrow}
        borrowing={borrowing}
        isBorrowed={isBorrowed}
      />

      {/* Reviews Section */}
      <BookReviews
        reviews={reviews}
        onAddReview={handleAddReview}
        onUpdateReview={handleUpdateReview}
        currentUserId={user?.id}
        isBorrowed={isBorrowed}
      />
    </div>
  );
}
