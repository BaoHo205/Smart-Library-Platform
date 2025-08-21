"use client"

import { useState } from "react"
import { Star, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Review {
  id: string
  userId: string
  bookId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  userName: string
  name: string
  userAvatar?: string
}

interface BookReviewsProps {
  reviews: Review[] | null
  onAddReview: (rating: number, comment: string) => void
  onUpdateReview: (reviewId: string, rating: number, comment: string) => void
  currentUserId?: string // Add this to identify the current authenticated user
}

export default function BookReviews({ reviews, onAddReview, onUpdateReview, currentUserId }: BookReviewsProps) {
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  // Edit state management
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editReviewText, setEditReviewText] = useState("")
  const [editReviewRating, setEditReviewRating] = useState(0)
  const [editHoveredStar, setEditHoveredStar] = useState(0)

  const handleAddReview = () => {
    if (!newReview.trim() || newRating === 0) return

    onAddReview(newRating, newReview)
    setNewReview("")
    setNewRating(0)
  }

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id)
    setEditReviewText(review.comment)
    setEditReviewRating(review.rating)
  }

  const handleSaveEdit = () => {
    if (!editReviewText.trim() || editReviewRating === 0 || !editingReviewId) return

    onUpdateReview(editingReviewId, editReviewRating, editReviewText)
    setEditingReviewId(null)
    setEditReviewText("")
    setEditReviewRating(0)
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setEditReviewText("")
    setEditReviewRating(0)
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void, isEdit = false) => {
    const hoverState = isEdit ? editHoveredStar : hoveredStar
    const setHoverState = isEdit ? setEditHoveredStar : setHoveredStar

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? hoverState || rating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && onStarClick?.(star)}
            onMouseEnter={() => interactive && setHoverState(star)}
            onMouseLeave={() => interactive && setHoverState(0)}
          />
        ))}
      </div>
    )
  }

  if (reviews === null) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Loading reviews...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
              <div className="flex items-center gap-2">{renderStars(newRating, true, setNewRating)}</div>

              <Textarea
                placeholder="Type your message here"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
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
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.userAvatar || "https://github.com/shadcn.png"} />
                  <AvatarFallback>
                    {review.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  {editingReviewId === review.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{review.userName}</span>
                      </div>

                      <div className="space-y-2">
                        {/* <label className="text-sm font-medium text-gray-700">Rating:</label> */}
                        {renderStars(editReviewRating, true, setEditReviewRating, true)}
                      </div>

                      <div className="space-y-2">
                        {/* <label className="text-sm font-medium text-gray-700">Comment:</label> */}
                        <Textarea
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          disabled={!editReviewText.trim() || editReviewRating === 0}
                          size="sm"
                          className="bg-slate-800 hover:bg-slate-700"
                        >
                          Save Changes
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{review.userName}</span>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">{new Date(review.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>

                      {/* Edit Button - Only show for current user's reviews */}
                      {currentUserId && review.userId === currentUserId && (
                        <Button
                          onClick={() => handleEditReview(review)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-8 w-8 p-0 hover:bg-gray-100"
                          title="Edit review"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
