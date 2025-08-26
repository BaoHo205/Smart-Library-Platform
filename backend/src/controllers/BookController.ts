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
      result
    });
  } catch (err) {
    console.error('Error retrieving books:', err);
    next(err);
  }
};

const getBookInfoById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get book information by ID'
  // #swagger.description = 'Retrieve detailed information about a specific book by its ID.'
  // #swagger.parameters['bookId'] = { description: 'Book ID to retrieve information for', type: 'string' }
  try {
    const { bookId } = req.params;

    if (!bookId) {
      res.status(400).json({
        success: false,
        message: 'Book ID is required',
      });
      return;
    }

    const bookInfo = await BookService.getBookInfoById(bookId);

    if (!bookInfo) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bookInfo,
    });
  } catch (error) {
    console.error('Error retrieving book info:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving book info',
    });
  }
};

const getAllReviewsByBookId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get all reviews for a specific book'
  // #swagger.description = 'Retrieve all reviews for a specific book by its ID with user information.'
  // #swagger.parameters['bookId'] = { description: 'Book ID to retrieve reviews for', type: 'string', in: 'path' }
  try {
    const { bookId } = req.params;

    if (!bookId) {
      res.status(400).json({
        success: false,
        message: 'Book ID is required',
      });
      return;
    }

    const reviews = await BookService.getAllReviewsByBookId(bookId);

    res.status(200).json({
      success: true,
      data: reviews,
      total: reviews.length,
    });
  } catch (error) {
    console.error('Error retrieving book reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving book reviews',
    });
  }
};

const isBookBorrowed = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

    if (!bookId) {
      res.status(400).json({
        success: false,
        message: 'Book ID is required',
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const result = await BookService.isBookBorrowed(bookId, userId);
    res.status(200).json({
      success: true,
      isBorrowed: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error checking borrow status: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
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
  authorIds: string;
  genreIds: string;
  avgRating: number;
}

const addNewBook = async (req: Request, res: Response): Promise<void> => {
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
const updateBookInventory = async (req: Request, res: Response): Promise<void> => {
  const { bookId } = req.params; // Book ID from URL
  const { quantity } = req.body; // New quantity from request body

  // Basic validation
  if (typeof quantity !== 'number' || quantity < 0) {
    res.status(400).json({ message: 'Invalid quantity provided. Quantity must be a non-negative number.' });
    return;
  }

  try {
    const updated = await BookService.updateBookInventory(bookId, quantity, PLACEHOLDER_STAFF_ID);
    if (updated) {
      res.status(200).json({ message: `Book ${bookId} inventory updated successfully to ${quantity}.` });
    } else {
      res.status(404).json({ message: `Book with ID ${bookId} not found.` });
    }
  } catch (error: unknown) {
    console.error(`Error in bookController.updateBookInventoryController for ID ${bookId}:`, error);
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
const retireBook = async (req: Request, res: Response): Promise<void> => {
  const { bookId } = req.params;

  try {
    const updated = await BookService.retireBook(bookId, PLACEHOLDER_STAFF_ID);
    if (updated) {
      res.status(200).json({ message: `Book ${bookId} status updated successfully to 'unavailable'.` });
    } else {
      res.status(404).json({ message: `Book with ID ${bookId} not found.` });
    }
  } catch (error: unknown) {
    console.error(`Error in bookController.retireBookController for ID ${bookId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

const addCopy = async (req: Request, res: Response): Promise<void> => {
  const { bookId } = req.params;

  try {
    const result = await BookService.addNewCopy(bookId, PLACEHOLDER_STAFF_ID);
    res.status(201).json({ message: `Book Copy has been created.`, data: result });

  } catch (error: unknown) {
    console.error(`Error in bookController.addCopy for ID ${bookId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

const deleteCopy = async (req: Request, res: Response): Promise<void> => {
  const { copyId } = req.params;

  try {
    const updated = await BookService.deleteBookCopyById(copyId, PLACEHOLDER_STAFF_ID);
    if (updated) {
      res.status(200).json({ message: `Book Copy ${copyId} has been deleted.` });
    } else {
      res.status(404).json({ message: `Book Copy with ID ${copyId} not found.` });
    }
  } catch (error: unknown) {
    console.error(`Error in bookController.deleteCopy for ID ${copyId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

const retireCopy = async (req: Request, res: Response): Promise<void> => {
  const { copyId } = req.params;

  try {
    const updated = await BookService.retireCopy(copyId, PLACEHOLDER_STAFF_ID);
    if (updated) {
      res.status(200).json({ message: `Book ${copyId} status updated successfully to 'unavailable'.` });
    } else {
      res.status(404).json({ message: `Book with ID ${copyId} not found.` });
    }
  } catch (error: unknown) {
    console.error(`Error in bookController.retireCopyController for ID ${copyId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  }
}

const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    console.log(bookId)
    const {
      title,
      thumbnailUrl,
      isbn,
      quantity,
      pageCount,
      publisherId,
      description,
      authorIds,
      genreIds,
      status,
      avgRating
    } = req.body;

    // Call the service function to execute the stored procedure.
    // We pass the fields that are provided, and let the service handle partial updates.
    await BookService.updateBook(
      {
        title,
        thumbnailUrl,
        isbn,
        quantity,
        pageCount,
        publisherId,
        description,
        authorIds,
        genreIds,
        avgRating
      },
      bookId,
      PLACEHOLDER_STAFF_ID
    );

    res.status(200).json({ message: 'Book updated successfully.' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book.', error: error });
  }
}

const getBookCopies = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    if (!bookId) {
      throw new Error('Missing bookId parameter');
    }

    const result = await BookService.getBookCopies(bookId);

    res.status(200).json({
      message: 'Get book copies successfully.',
      result: result
    });
  } catch (error) {
    console.error('Error getting book copies:', error);
    res.status(500).json({ message: 'Failed get book copies.', error: error });
  }
}

export default {
  borrowBook,
  returnBook,
  getBooks,
  addNewBook,
  updateBookInventory,
  retireBook,
  getBookInfoById,
  getAllReviewsByBookId,
  isBookBorrowed,
  getBookCopies,
  updateBook,
  retireCopy,
  addCopy,
  deleteCopy
};