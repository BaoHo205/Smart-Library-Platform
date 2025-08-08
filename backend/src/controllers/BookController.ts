import { Request, Response } from 'express';
import { Book } from '../models/BookModel';
import * as bookService from '../services/BookService';
import { v4 as uuidv4 } from 'uuid';

const PLACEHOLDER_STAFF_ID = 'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18';

/**
 * Handles GET /api/books requests to retrieve all books.
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 */
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books: Book[] = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error: unknown) {
        console.error('Error in bookController.getAllBooks:', error);

        // Safely check if 'error' is an instance of Error
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            // Handle cases where 'error' might be a string, number, or other type
            res.status(500).json({ message: 'Internal server error', error: String(error) });
        }
    }
}

export const addNewBook = async (req: Request, res: Response): Promise<void> => {
    const newBookId = uuidv4();

    const bookData: Book = { ...req.body, id: newBookId };

    if (!bookData.title) {
        res.status(400).json({ message: 'Book title is required' });
        return;
    }

    try {
        const addedBook = await bookService.addNewBook(bookData, PLACEHOLDER_STAFF_ID);
        res.status(201).json({ message: 'Book created successfully', book: addedBook });
    } catch (error: unknown) {
        console.error('Error in bookController.createBook:', addNewBook);
        if (error instanceof Error) {
            // Check for specific MySQL errors if needed, e.g., duplicate entry for unique ISBN
            if (error.message.includes('Duplicate entry')) { // Simple string check, replace with error codes for robustness
                res.status(409).json({ message: 'Conflict: A book with this ID or ISBN already exists.', error: error.message });
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
    const { status } = req.body; // New status from request body

    // Basic validation for allowed status values (must match ENUM in DB)
    const allowedStatuses: Book['status'][] = ['available', 'borrowed', 'lost', 'damaged', 'maintenance'];
    if (!status || !allowedStatuses.includes(status)) {
        res.status(400).json({ message: `Invalid status provided. Allowed statuses: ${allowedStatuses.join(', ')}` });
        return;
    }

    try {
        const updated = await bookService.updateBookStatus(id, status, PLACEHOLDER_STAFF_ID);
        if (updated) {
            res.status(200).json({ message: `Book ${id} status updated successfully to '${status}'.` });
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