'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookAvailability } from '@/types/reports.type';
import { AlertTriangleIcon, PackageIcon, TrendingDownIcon, MinusIcon, CheckCircleIcon, BookOpenIcon, BarChart3Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LowAvailabilityChartProps {
  books: BookAvailability[];
  loading: boolean;
}

export function LowAvailabilityChart({
  books,
  loading,
}: LowAvailabilityChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAvailabilityStatus = (percentage: number, availableCopies: number) => {
    if (availableCopies === 0) return 'Out of Stock';
    if (percentage <= 10) return 'Critical';
    if (percentage <= 25) return 'Low';
    if (percentage <= 50) return 'Moderate';
    return 'Good';
  };

  const getAvailabilityIconColor = (percentage: number) => {
    if (percentage <= 10) return 'text-red-500';
    if (percentage <= 25) return 'text-orange-500';
    if (percentage <= 50) return 'text-yellow-500';
    if (percentage <= 75) return 'text-blue-500';
    return 'text-green-500';
  };

  // Categorize books by availability
  const categorizedBooks = {
    'Out of Stock': books.filter(book => book.availableCopies === 0),
    'Low Availability': books.filter(book => book.availableCopies > 0 && book.availability_percentage <= 25),
    'Moderate': books.filter(book => book.availability_percentage > 25 && book.availability_percentage <= 50),
    'Good': books.filter(book => book.availability_percentage > 50)
  };

  const categoryConfig = {
    'Out of Stock': {
      icon: PackageIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    'Low Availability': {
      icon: TrendingDownIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    },
    'Moderate': {
      icon: MinusIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    'Good': {
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Books with Low Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="books" className="w-full px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="books" className="flex items-center space-x-2">
              <BookOpenIcon className="h-4 w-4" />
              <span>Books List</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <BarChart3Icon className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-4">
            <div className="h-[520px] overflow-y-auto space-y-2 px-6 pb-6">
              {books.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    All books have good availability
                  </p>
                </div>
              ) : (
                books.map((book, index) => (
                  <div
                    key={book.bookId}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangleIcon
                        className={`h-4 w-4 ${getAvailabilityIconColor(book.availability_percentage)}`}
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="line-clamp-1 text-sm font-medium text-gray-900">
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {book.availableCopies} of {book.quantity} available
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {getAvailabilityStatus(book.availability_percentage, book.availableCopies)}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {book.availability_percentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Availability Categories Overview
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Click on any category to see detailed book information
                  </p>
                </div>
                
                {Object.entries(categorizedBooks).map(([category, booksInCategory]) => {
                  const config = categoryConfig[category as keyof typeof categoryConfig];
                  const IconComponent = config.icon;
                  
                  return (
                    <Dialog key={category}>
                      <DialogTrigger asChild>
                        <button
                          className="w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${config.bgColor}`}>
                                <IconComponent className={`h-5 w-5 ${config.textColor}`} />
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-medium text-gray-900">{category}</h4>
                                <p className="text-xs text-gray-500">
                                  {booksInCategory.length} book{booksInCategory.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={`${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                                {booksInCategory.length}
                              </Badge>
                              <div className="text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <IconComponent className={`h-5 w-5 ${config.textColor}`} />
                            <span>{category}</span>
                            <Badge variant="secondary" className={`${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                              {booksInCategory.length} book{booksInCategory.length !== 1 ? 's' : ''}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="overflow-y-auto max-h-[60vh] space-y-3 pr-2">
                          {booksInCategory.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                              No books in this category
                            </div>
                          ) : (
                            booksInCategory.map((book) => (
                              <div key={book.bookId} className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-500">Available:</span>
                                        <span className="ml-2 font-medium text-gray-900">
                                          {book.availableCopies} of {book.quantity}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Percentage:</span>
                                        <span className="ml-2 font-medium text-gray-900">
                                          {book.availability_percentage}%
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Status:</span>
                                        <Badge 
                                          variant="outline" 
                                          className={`ml-2 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                                        >
                                          {getAvailabilityStatus(book.availability_percentage, book.availableCopies)}
                                        </Badge>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Recent Checkouts:</span>
                                        <span className="ml-2 font-medium text-gray-900">
                                          {book.recent_checkouts}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
