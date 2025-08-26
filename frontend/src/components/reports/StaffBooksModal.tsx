'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MostBorrowedBook } from '@/types/reports.type';
import { BookOpenIcon } from 'lucide-react';

interface StaffBooksModalProps {
    books: MostBorrowedBook[];
    isOpen: boolean;
    onClose: () => void;
    onBookClick: (bookId: string) => void;
    title: string;
}

export function StaffBooksModal({ books, isOpen, onClose, onBookClick, title }: StaffBooksModalProps) {
    const handleBookClick = (bookId: string) => {
        const book = books.find(b => b.bookId === bookId);
        if (book) {
            window.open(`/books/${bookId}`, '_blank');
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
                    minWidth: '98vw'
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="h-[80vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {books.map((book, index) => (
                            <Card
                                key={book.bookId}
                                className="relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 border border-gray-200 bg-white rounded-xl group shadow-md shadow-gray-100/50"
                                onClick={() => handleBookClick(book.bookId)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col h-full">
                                        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                                            <div className="absolute top-3 left-3 z-10">
                                                <Badge variant="secondary" className="bg-gray-900 text-white text-xs px-2 py-1 font-bold shadow-md">
                                                    #{index + 1}
                                                </Badge>
                                            </div>

                                            <div className="absolute top-3 right-3 z-10">
                                                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 text-xs px-2 py-1 font-semibold shadow-md">
                                                    {book.total_checkouts.toLocaleString()}
                                                </Badge>
                                            </div>

                                            <div className="w-full h-full flex items-center justify-center border-b border-gray-100 p-2">
                                                {book.coverUrl ? (
                                                    <img
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                        <div className="text-sm text-gray-400 font-medium">No Cover</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-4 space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                                                            {book.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 line-clamp-1 font-medium">
                                                            by {book.authors}
                                                        </p>
                                                    </div>
                                                    <div className="relative ml-2 flex-shrink-0">
                                                        <div className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group/question">
                                                            <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/question:opacity-100 transition-opacity duration-200 z-[99999] pointer-events-none w-64">
                                                                <div className="text-left leading-relaxed">
                                                                    <p className="font-medium mb-2">Metrics Explanation</p>
                                                                    <p className="text-gray-200 mb-1"><strong>Checkouts:</strong> Total times this book was borrowed</p>
                                                                    <p className="text-gray-200 mb-1"><strong>Available:</strong> Current copies available for checkout</p>
                                                                    <p className="text-gray-200"><strong>Total:</strong> Total copies in inventory</p>
                                                                </div>
                                                                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3 pt-2">
                                                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="text-sm font-bold text-gray-900">{book.total_checkouts.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500 font-medium">Checkouts</div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="text-sm font-bold text-gray-900">{book.availableCopies}</div>
                                                    <div className="text-xs text-gray-500 font-medium">Available</div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="text-sm font-bold text-gray-900">{book.quantity}</div>
                                                    <div className="text-xs text-gray-500 font-medium">Total</div>
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
