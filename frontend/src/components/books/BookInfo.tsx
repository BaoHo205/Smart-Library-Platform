"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BookDetail from "@/components/books/BookDetail"
import BookReviews from "@/components/books/BookReviews"
import api from "@/api/api"
import type { BookDetails, IReview } from "@/api/api"
import useUser from "@/hooks/useUser"

// Interface to match BookDetail component props
interface BookDetailType {
  id: string
  title: string
  author: string
  genre: string[]
  publisher: string
  description: string
  coverImage?: string
  rating: number
  totalReviews: number
  offlineLocation?: string
}

// Interface to match Review component props
export interface Review {
  id: string
  userId: string
  bookId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  userName: string
  // userAvatar?: string
  name: string
}

// Adapter function to convert BookDetails to BookDetailType
const adaptBookDetails = (book: BookDetails): BookDetailType => {
  return {
    id: book.id,
    title: book.title,
    author: book.authors.join(", "),
    genre: book.genres,
    publisher: book.publisherName,
    description: book.description || "No description available",
    coverImage: book.thumbnailUrl || undefined,
    rating: book.avgRating,
    totalReviews: book.numberOfRatings,
    offlineLocation: undefined, // We don't have this in the API
  }
}

const adaptReview = (review: IReview): Review => {
  return {
    id: review.id,
    userId: review.userId,
    bookId: review.bookId,
    rating: review.rating,
    comment: review.comment || "",
    createdAt: review.createdAt.toString(),
    updatedAt: review.updatedAt.toString(),
    userName: review.name || review.userName,
    name: review.name,
  }
}

interface BookDetailPageProps {
  bookId: string
}

export default function BookInfoPage({ bookId = "0418ba35-d180-4c9c-8cca-b9b41a46e65e" }: BookDetailPageProps) {
  const { isAuthenticated, user } = useUser() // Get user object to access user ID
  const [book, setBook] = useState<BookDetailType | null>(null)
  const [reviews, setReviews] = useState<Review[] | null>(null) // Use null to check if data has been fetched
  const [loading, setLoading] = useState(false) // Start with loading true
  const [error, setError] = useState<string | null>(null)

  // API functions ready for later implementation
  const fetchBookData = async () => {
    setLoading(true)
    setError(null)
    setBook(null)
    setReviews(null)

    try {
      // Use the bookId prop in the API call
      const [bookResponse, reviewsResponse] = await Promise.all([
        api.getBookInfoById(bookId),
        api.getReviewsByBookId(bookId),
      ])
      console.log("Book Response:", bookResponse)
      console.log("Reviews Response:", reviewsResponse)
      // Convert API responses to component-friendly formats
      setBook(adaptBookDetails(bookResponse))
      setReviews(reviewsResponse.map(adaptReview))
    } catch (err) {
      setError("Failed to fetch book data. Please check the book ID and try again.")
      console.error("Error fetching book data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if bookId is available
    if (bookId) {
      fetchBookData()
    }
  }, [bookId])

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      if (!isAuthenticated) {
        console.error("User not authenticated")
        return
      }

      await api.addReview(bookId, rating, comment)

      // Re-fetch reviews to update the list
      const updatedBookInfo = await api.getBookInfoById(bookId)
      setBook(adaptBookDetails(updatedBookInfo)) // consider to use useState for book rating after update.

      const updatedReviews = await api.getReviewsByBookId(bookId)
      setReviews(updatedReviews.map(adaptReview))
    } catch (err) {
      console.error("Error adding review:", err)
      // You might want to set a state to show an error message to the user.
    }
  }

  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    try {
      if (!isAuthenticated) {
        console.error("User not authenticated")
        return
      }

      // Call your API to update the review
      await api.updateReview(reviewId, rating, comment)

      // Re-fetch both book info and reviews to update the UI
      const [updatedBookInfo, updatedReviews] = await Promise.all([
        api.getBookInfoById(bookId),
        api.getReviewsByBookId(bookId),
      ])

      setBook(adaptBookDetails(updatedBookInfo)) // Update book rating if it changed
      setReviews(updatedReviews.map(adaptReview))

      console.log("Review updated successfully")
    } catch (err) {
      console.error("Error updating review:", err)
      // You might want to set a state to show an error message to the user
      // For now, we could show a toast notification or set an error state
    }
  }

  // Render states
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-200 aspect-[3/4] rounded-lg"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">{error || "Book not found"}</p>
            <Button onClick={fetchBookData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Book Detail Section */}
      <BookDetail book={book} />

      {/* Reviews Section */}
      <BookReviews
        reviews={reviews}
        onAddReview={handleAddReview}
        onUpdateReview={handleUpdateReview}
        currentUserId={user?.id} 
      />
    </div>
  )
}
