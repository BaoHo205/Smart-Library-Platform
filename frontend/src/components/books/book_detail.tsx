"use client"

import { Star, MapPin, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BookDetail {
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

interface BookDetailProps {
  book: BookDetail
}

export default function BookDetail({ book }: BookDetailProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Book Header */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <div className="w-full h-full min-h-[400px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
              <Book className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                {renderStars(book.rating)}
                <span className="text-gray-600">{book.totalReviews.toLocaleString()} customers review</span>
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
                      <Badge key={index} variant="secondary" className="text-sm">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Publisher: </span>
                  <span className="text-gray-600">{book.publisher}</span>
                </div>

                {book.offlineLocation && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Offline Available</span>
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{book.offlineLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="bg-slate-800 hover:bg-slate-700">
              <Book className="w-4 h-4 mr-2" />
              Borrow
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <div className="text-gray-700 leading-relaxed space-y-4">
          {book.description.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
