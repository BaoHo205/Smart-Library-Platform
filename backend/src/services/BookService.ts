import { Book } from '../models/BookModel';
import mysqlConnection from '../database/mysql/connection';
import { ResultSetHeader } from 'mysql2/promise';
import { createStaffLog } from "./StaffLogService";

/**
 * 
 * Retrieves all books from the database.
 * @returns {Promise<Book[]>} A promise that resolves to an array of Book objects.
 */
const getAllBooks = async (): Promise<Book[]> => {
    try {
        const query = 'SELECT * FROM Book';
        const [rows] = await mysqlConnection.executeQuery(query);
        // Cast the raw query results to the IBook interface for type safety
        return rows as Book[];
    } catch (error) {
        console.error('Error in bookService.getAllBooks:', error);
        // Ensure error message is handled safely (as 'unknown' type)
        if (error instanceof Error) {
            throw new Error(`Could not create book: ${error.message}`);
        } else {
            throw new Error(`Could not create book: ${String(error)}`);
        }
    }
}

/**
 * Creates a new book record in the database.
 * @param {Book} bookData The data for the new book.
 * @returns {Promise<Book>} A promise that resolves to the created Book object.
 */
const addNewBook = async (bookData: Book, staffId: string): Promise<Book> => {
    try {
        const query = `
            INSERT INTO Book (id, title, thumbnail_url, isbn, quantity, page_count, publisher_id, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            bookData.id,
            bookData.title,
            bookData.thumbnail_url || null,
            bookData.isbn || null,
            bookData.quantity || null,
            bookData.page_count || null,
            bookData.publisher_id || null,
            bookData.description || null,
            bookData.status || 'available'
        ];
        await createStaffLog({
            staff_id: staffId,
            action_type: 'add_book',
            action_details: `Added new book: "${bookData.title}" (ID: ${bookData.id}, ISBN: ${bookData.isbn || 'N/A'})`
        });

        const [results] = await mysqlConnection.executeQuery(query, params);

        return bookData;
    } catch (error) {
        console.error('Error in bookService.addNewBook:', error);
        // Ensure error message is handled safely (as 'unknown' type)
        if (error instanceof Error) {
            throw new Error(`Could not create book: ${error.message}`);
        } else {
            throw new Error(`Could not create book: ${String(error)}`);
        }
    }
}

/**
 * Updates the quantity of a specific book.
 * @param {string} bookId The ID of the book to update.
 * @param {number} newQuantity The new quantity for the book.
 * @returns {Promise<boolean>} A promise that resolves to true if updated, false if book not found.
 */
const updateBookInventory = async (bookId: string, newQuantity: number, staffId: string): Promise<boolean> => {
    try {
        const query = 'UPDATE Book SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const [results] = await mysqlConnection.executeQuery(query, [newQuantity, bookId]);

        const updated = (results as ResultSetHeader).affectedRows > 0;

        if (updated) {
            // Log the action after successful update
            await createStaffLog({
                staff_id: staffId,
                action_type: 'system_maintenance',
                action_details: `Updated inventory for book ID ${bookId} to quantity ${newQuantity}.`
            });
        }

        return updated;
    } catch (error) {
        console.error(`Error in bookService.updateBookInventory for ID ${bookId}:`, error);
        if (error instanceof Error) {
            throw new Error(`Could not update book inventory: ${error.message}`);
        } else {
            throw new Error(`Could not update book inventory: ${String(error)}`);
        }
    }
}

/**
 * Updates the status of a specific book (e.g., to 'lost', 'damaged', 'maintenance', 'retired').
 * @param {string} bookId The ID of the book to update.
 * @param {'available' | 'borrowed' | 'lost' | 'damaged' | 'maintenance'} newStatus The new status for the book.
 * @returns {Promise<boolean>} A promise that resolves to true if updated, false if book not found.
 */
const updateBookStatus = async (bookId: string, newStatus: Book['status'], staffId: string): Promise<boolean> => {
    if (!newStatus) {
        throw new Error("New status cannot be null or undefined.");
    }
    try {
        const query = 'UPDATE Book SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const [results] = await mysqlConnection.executeQuery(query, [newStatus, bookId]);

        const updated = (results as ResultSetHeader).affectedRows > 0;

        if (updated) {
            // Log the action after successful update
            await createStaffLog({
                staff_id: staffId,
                action_type: 'other', // Or 'retire_book' if added to ENUM
                action_details: `Changed status for book ID ${bookId} to '${newStatus}'. (Retirement/Maintenance action)`
            });
        }

        return updated;
    } catch (error) {
        console.error(`Error in bookService.updateBookStatus for ID ${bookId}:`, error);
        if (error instanceof Error) {
            throw new Error(`Could not update book status: ${error.message}`);
        } else {
            throw new Error(`Could not update book status: ${String(error)}`);
        }
    }
}

export { getAllBooks, addNewBook, updateBookInventory, updateBookStatus }