import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/authMiddleware';
import BookService from '@/services/BookService';
import { BookStatus } from '@/models/mysql/enum/BookStatus';

const PLACEHOLDER_STAFF_ID = '026766aa-71e0-11f0-b7ee-4b6c3be6ce57';

const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate pagination parameters
    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize
      ? Number(req.query.pageSize)
      : undefined;

    if (page !== undefined && (isNaN(page) || page < 1)) {
      res.status(400).json({
        success: false,
        message: 'Page must be a positive number',
      });
      return;
    }

    if (
      pageSize !== undefined &&
      (isNaN(pageSize) || pageSize < 1 || pageSize > 100)
    ) {
      res.status(400).json({
        success: false,
        message: 'Page size must be a positive number between 1 and 100',
      });
      return;
    }

    // Validate sort parameter
    const validSortFields = ['title', 'publisher', 'available'];
    const sort = req.query.sort as string;
    if (sort && !validSortFields.includes(sort)) {
      res.status(400).json({
        success: false,
        message: `Invalid sort field. Must be one of: ${validSortFields.join(', ')}`,
      });
      return;
    }

    // Validate order parameter
    const validOrderValues = ['asc', 'desc'];
    const order = req.query.order as string;
    if (order && !validOrderValues.includes(order)) {
      res.status(400).json({
        success: false,
        message: `Invalid order value. Must be one of: ${validOrderValues.join(', ')}`,
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
      order: order as 'asc' | 'desc',
    });

    if (!result) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve books',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
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
        message: 'User not authenticated',
      });
      return;
    }

    if (!bookId) {
      res.status(400).json({
        success: false,
        message: 'Book ID is required',
      });
      return;
    }

    if (!dueDate) {
      res.status(400).json({
        success: false,
        message: 'Due date is required',
      });
      return;
    }

    // Validate due date format and ensure it's in the future
    const dueDateObj = new Date(dueDate);
    const today = new Date();

    if (isNaN(dueDateObj.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid due date format',
      });
      return;
    }

    if (dueDateObj <= today) {
      res.status(400).json({
        success: false,
        message: 'Due date must be in the future',
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
          checkoutDate: new Date().toISOString().split('T')[0],
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while borrowing book',
    });
  }
};

const returnBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }

    if (!bookId) {
      res.status(400).json({ success: false, message: 'Book ID is required' });
      return;
    }

    const result = await BookService.returnBook(userId, bookId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          isLate: result.isLate,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in returnBook controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export interface NewBook {
  title: string;
  thumbnailUrl: string;
  isbn: string;
  quantity: number | 0;
  pageCount: number;
  publisherId: string;
  description: string;
  status: BookStatus;
  authorIds: string,
  genreIds: string
}

export const addNewBook = async (req: Request, res: Response): Promise<void> => {
  const bookData: NewBook = req.body;

  if (!bookData.title) {
    res.status(400).json({ message: 'Book title is required' });
    return;
  }

  // Validate that all required fields are present
  if (!bookData.title || !bookData.authorIds || !bookData.genreIds || !bookData.publisherId) {
    res.status(400).json({ message: 'Book title, author IDs, genre IDs, and publisher ID are required' });
    return;
  }

  try {
    const addedBook = await BookService.addNewBook(bookData, PLACEHOLDER_STAFF_ID);
    res.status(201).json({ message: 'Book created successfully', book: addedBook });
  } catch (error: unknown) {
    console.error('Error in bookController.createBook:', error);
    if (error instanceof Error) {
      // Check for specific MySQL errors like foreign key constraints or duplicates
      if (error.message.includes('Duplicate entry')) {
        res.status(409).json({ message: 'Conflict: A book with this ID or ISBN already exists.', error: error.message });
      } else if (error.message.includes('Foreign key constraint failed')) {
        res.status(400).json({ message: 'Bad request: Invalid author, genre, or publisher ID.', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

/**
 * Handles PUT /api/books/:id/inventory requests to update book quantity.
 * Expected body: { "quantity": number }
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 */
export const updateBookInventory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Book ID from URL
  const { quantity } = req.body; // New quantity from request body

  // Basic validation
  if (typeof quantity !== 'number' || quantity < 0) {
    res.status(400).json({ message: 'Invalid quantity provided. Quantity must be a non-negative number.' });
    return;
  }

  try {
    const updated = await BookService.updateBookInventory(id, quantity, PLACEHOLDER_STAFF_ID);
    if (updated) {
      res.status(200).json({ message: `Book ${id} inventory updated successfully to ${quantity}.` });
    } else {
      res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
  } catch (error: unknown) {
    console.error(`Error in bookController.updateBookInventoryController for ID ${id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

/**
 * Handles PUT /api/books/:id/status requests to retire/change book status.
 * Expected body: { "status": "lost" | "damaged" | "maintenance" | "available" | "borrowed" }
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 */
export const retireBook = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Book ID from URL
  //const { status } = req.body; // New status from request body

  // Basic validation for allowed status values (must match ENUM in DB)
  // const allowedStatuses: Book['status'][] = [BookStatus.AVAILABLE, BookStatus.UNAVAILABLE];
  // if (!status || !allowedStatuses.includes(status)) {
  //   res.status(400).json({ message: `Invalid status provided. Allowed statuses: ${allowedStatuses.join(', ')}` });
  //   return;
  // }

  try {
    const updated = await BookService.retireBook(id, PLACEHOLDER_STAFF_ID);
    if (updated) {
      res.status(200).json({ message: `Book ${id} status updated successfully to 'unavailable'.` });
    } else {
      res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
  } catch (error: unknown) {
    console.error(`Error in bookController.retireBookController for ID ${id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

export default { borrowBook, returnBook, getBooks, addNewBook, updateBookInventory, retireBook };