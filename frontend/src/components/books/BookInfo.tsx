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

// Helper function to generate due date (2 weeks from now)
const generateDueDate = (): string => {
  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(today.getDate() + 14) // 2 weeks from now
  return dueDate.toISOString().split("T")[0] // Format: yyyy-mm-dd
}

interface BookDetailPageProps {
  bookId: string
}

export default function BookInfoPage({ bookId = "0418ba35-d180-4c9c-8cca-b9b41a46e65e" }: BookDetailPageProps) {
  const { user } = useUser() // User is guaranteed to be authenticated
  const [book, setBook] = useState<BookDetailType | null>(null)
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [borrowing, setBorrowing] = useState(false)
  const [isBorrowed, setIsBorrowed] = useState(false)

  const fetchBookData = async () => {
    setLoading(true)
    setError(null)
    setBook(null)
    setReviews(null)

    try {
      const [bookResponse, reviewsResponse] = await Promise.all([
        api.getBookInfoById(bookId),
        api.getReviewsByBookId(bookId),
      ])

      setBook(adaptBookDetails(bookResponse))
      setReviews(reviewsResponse.map(adaptReview))

      // Check if current user has already borrowed this book
      // You might need to add this API call or check from the book response
      // For now, we'll assume the book response includes this information
      // setIsBorrowed(bookResponse.isBorrowedByCurrentUser || false)
    } catch (err) {
      setError("Failed to fetch book data. Please check the book ID and try again.")
      console.error("Error fetching book data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bookId) {
      fetchBookData()
    }
  }, [bookId])

  const handleBorrow = async () => {
    try {
      setBorrowing(true)
      const dueDate = generateDueDate()

      await api.borrowBook(bookId, dueDate)

      // Set borrowed state to true after successful borrow
      setIsBorrowed(true)

      // Refresh book data to update availability status
      await fetchBookData()

      console.log("Book borrowed successfully")
      // You might want to show a success message
    } catch (err) {
      console.error("Error borrowing book:", err)
      setError("Failed to borrow book. Please try again.")
    } finally {
      setBorrowing(false)
    }
  }

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      await api.addReview(bookId, rating, comment)

      // Refresh data to show new review and updated rating
      const [updatedBookInfo, updatedReviews] = await Promise.all([
        api.getBookInfoById(bookId),
        api.getReviewsByBookId(bookId),
      ])

      setBook(adaptBookDetails(updatedBookInfo))
      setReviews(updatedReviews.map(adaptReview))
    } catch (err) {
      console.error("Error adding review:", err)
      setError("Failed to add review. Please try again.")
    }
  }

  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    try {
      await api.updateReview(reviewId, rating, comment)

      // Refresh data to show updated review and rating
      const [updatedBookInfo, updatedReviews] = await Promise.all([
        api.getBookInfoById(bookId),
        api.getReviewsByBookId(bookId),
      ])

      setBook(adaptBookDetails(updatedBookInfo))
      setReviews(updatedReviews.map(adaptReview))
    } catch (err) {
      console.error("Error updating review:", err)
      setError("Failed to update review. Please try again.")
    }
  }

  // Loading state
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

  // Error state
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
      <BookDetail book={book} onBorrow={handleBorrow} borrowing={borrowing} isBorrowed={isBorrowed} />

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
