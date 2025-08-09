import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/authMiddleware';
import BookService from '@/services/BookService';


const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate pagination parameters
        const page = req.query.page ? Number(req.query.page) : undefined;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;

        if (page !== undefined && (isNaN(page) || page < 1)) {
            res.status(400).json({
                success: false,
                message: 'Page must be a positive number'
            });
            return;
        }

        if (pageSize !== undefined && (isNaN(pageSize) || pageSize < 1 || pageSize > 100)) {
            res.status(400).json({
                success: false,
                message: 'Page size must be a positive number between 1 and 100'
            });
            return;
        }

        // Validate sort parameter
        const validSortFields = ['title', 'publisher', 'available'];
        const sort = req.query.sort as string;
        if (sort && !validSortFields.includes(sort)) {
            res.status(400).json({
                success: false,
                message: `Invalid sort field. Must be one of: ${validSortFields.join(', ')}`
            });
            return;
        }

        // Validate order parameter
        const validOrderValues = ['asc', 'desc'];
        const order = req.query.order as string;
        if (order && !validOrderValues.includes(order)) {
            res.status(400).json({
                success: false,
                message: `Invalid order value. Must be one of: ${validOrderValues.join(', ')}`
            });
            return;
        }

        const result = await BookService.searchBooks({
            q: req.query.q as string,
            title: req.query.title as string,
            author: req.query.author as string,
            genre: req.query.genre as string,
            publisher: req.query.publisher as string,
            page,
            pageSize,
            sort: sort as 'title' | 'publisher' | 'available',
            order: order as 'asc' | 'desc'
        });

        if (!result) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve books'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Error retrieving books:', err);
        next(err);
    }
};

const borrowBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { bookId } = req.params;
        const { dueDate } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }

        if (!bookId) {
            res.status(400).json({
                success: false,
                message: 'Book ID is required'
            });
            return;
        }

        if (!dueDate) {
            res.status(400).json({
                success: false,
                message: 'Due date is required'
            });
            return;
        }

        // Validate due date format and ensure it's in the future
        const dueDateObj = new Date(dueDate);
        const today = new Date();
        
        if (isNaN(dueDateObj.getTime())) {
            res.status(400).json({
                success: false,
                message: 'Invalid due date format'
            });
            return;
        }

        if (dueDateObj <= today) {
            res.status(400).json({
                success: false,
                message: 'Due date must be in the future'
            });
            return;
        }

        const result = await BookService.borrowBook(userId, bookId, dueDate);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    checkoutId: result.checkoutId,
                    userId,
                    bookId,
                    dueDate,
                    checkoutDate: new Date().toISOString().split('T')[0]
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while borrowing book'
        });
    }
};

const checkBookAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bookId } = req.params;

        if (!bookId) {
            res.status(400).json({
                success: false,
                message: 'Book ID is required'
            });
            return;
        }

        const isAvailable = await BookService.isBookAvailable(bookId);

        res.status(200).json({
            success: true,
            data: {
                bookId,
                isAvailable
            }
        });
    } catch (error) {
        console.error('Error checking book availability:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while checking book availability'
        });
    }
};

export default { borrowBook, getBooks, checkBookAvailability };
