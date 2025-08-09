"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BookDetail from "@/components/books/book_detail"
import BookReviews from "@/components/books/book_reviews"

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

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
}

interface BookDetailPageProps {
  bookId: string
}

// Mock data
const mockBook: BookDetailType = {
  id: "1",
  title: "Application Health and Well-being",
  author: "Robert L.Ludke",
  genre: ["Health", "Psychology", "Woman"],
  publisher: "FTECH",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  rating: 0,
  totalReviews: 1000,
  offlineLocation: "Beanland Library",
}

const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "This book completely changed my perspective on health and well-being. The author provides practical insights that are easy to implement in daily life.",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Great resource for anyone interested in psychology and health. Well-researched and engaging throughout.",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mike Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Excellent book! The chapters on mental health were particularly insightful. Highly recommend to healthcare professionals.",
    createdAt: "2024-01-05T09:15:00Z",
  },
]

export default function BookDetailPage({ bookId = "1" }: BookDetailPageProps) {
  const [book, setBook] = useState<BookDetailType | null>(mockBook)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API functions ready for later implementation
  const fetchBookData = async () => {
    try {
      setLoading(true)
      const [bookResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/books/${bookId}`),
        axios.get(`http://localhost:5000/api/v1/books/${bookId}/reviews`),
      ])

      setBook(bookResponse.data)
      setReviews(reviewsResponse.data)
    } catch (err) {
      setError("Failed to fetch book data")
      console.error("Error fetching book data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReview = (rating: number, comment: string) => {
    // For now, add review to local state (replace with API call later)
    const newReviewData: Review = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "Current User",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString(),
    }

    setReviews((prev) => [newReviewData, ...prev])

    // TODO: Uncomment when API is ready
    /*
    try {
      const reviewData = {
        rating: rating,
        comment: comment,
        userId: "current-user-id",
        userName: "Current User",
      }

      await axios.post(`http://localhost:5000/api/v1/books/${bookId}/reviews`, reviewData)
      
      // Refresh reviews after adding
      const reviewsResponse = await axios.get(`http://localhost:5000/api/v1/books/${bookId}/reviews`)
      setReviews(reviewsResponse.data)
    } catch (err) {
      console.error("Error adding review:", err)
    }
    */
  }

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
      <BookReviews reviews={reviews} onAddReview={handleAddReview} />
    </div>
  )
}
