'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface BookReviewsProps {
  reviews: Review[];
  onAddReview: (rating: number, comment: string) => void;
}

export default function BookReviews({
  reviews,
  onAddReview,
}: BookReviewsProps) {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleAddReview = () => {
    if (!newReview.trim() || newRating === 0) return;

    onAddReview(newRating, newReview);
    setNewReview('');
    setNewRating(0);
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? hoveredStar || rating : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Review</h2>
        <span className="text-gray-600">{reviews.length} reviews</span>
      </div>

      {/* Add Review Form */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                {renderStars(newRating, true, setNewRating)}
              </div>

              <Textarea
                placeholder="Type your message here"
                value={newReview}
                onChange={e => setNewReview(e.target.value)}
                className="min-h-[100px]"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleAddReview}
                  disabled={!newReview.trim() || newRating === 0}
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  Add Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage
                    src={
                      review.userAvatar || '/placeholder.svg?height=40&width=40'
                    }
                  />
                  <AvatarFallback>
                    {review.userName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {review.userName}
                    </span>
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              No reviews yet. Be the first to review this book!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
