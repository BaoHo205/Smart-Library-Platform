import { Request, Response, NextFunction } from 'express';
// import { searchBooks, addNewBook, updateBookInventory, retireBook } from '@/services/BookService';
import { Book } from '@/models/mysql/Book';
import * as bookService from '@/services/BookService';
import { BookStatus } from '@/models/mysql/enum/BookStatus';

const PLACEHOLDER_STAFF_ID = '026766aa-71e0-11f0-b7ee-4b6c3be6ce57';

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookService.searchBooks({
      q: req.query.q as string,
      title: req.query.title as string,
      author: req.query.author as string,
      genre: req.query.genre as string,
      publisher: req.query.publisher as string,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      sort: (req.query.sort as 'title' | 'publisher' | 'available'),
      order: (req.query.order as 'asc' | 'desc')
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

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
    const addedBook = await bookService.addNewBook(bookData, PLACEHOLDER_STAFF_ID);
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
    const updated = await bookService.updateBookInventory(id, quantity, PLACEHOLDER_STAFF_ID);
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
    const updated = await bookService.retireBook(id, PLACEHOLDER_STAFF_ID);
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