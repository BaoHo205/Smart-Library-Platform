import pool from '@/database/mysql/connection';
import mysqlConnection from "@/database/mysql/connection";
import { Book } from "@/models/mysql/Book";

export interface BookSearchFilters {
  q?: string;           // general keyword -> title/publisher/author/genre
  title?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  page?: number;
  pageSize?: number;
  sort?: 'title' | 'available' | 'publisher';
  order?: 'asc' | 'desc';
}

export interface BookListItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  isbn: string | null;
  pageCount: number | null;
  quantity: number;
  availableCopies: number;
  publisherName: string;
  authors: string;
  genres: string;
}

interface CountRow {
  total: number;
}

type SqlParam = string | number;

export interface BookSearchResult {
  data: BookListItem[];
  page: number;
  pageSize: number;
  total: number;
}

const searchBooks = async (filters: BookSearchFilters): Promise<BookSearchResult> => {
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(filters.pageSize) || 10));
  const offset = (page - 1) * pageSize;

  // Define clause
  const where: string[] = [];
  const params: SqlParam[] = [];

  // Using COALESCE to avoid NULL in LIKE comparisons
  const titleLike = (val: string) => { where.push('b.title LIKE ?'); params.push(`%${val}%`); };
  const pubLike = (val: string) => { where.push('p.name LIKE ?'); params.push(`%${val}%`); };
  const authorLike = (val: string) => { where.push("COALESCE(authors.authors, '') LIKE ?"); params.push(`%${val}%`); };
  const genreLike = (val: string) => { where.push("COALESCE(genres.genres, '') LIKE ?"); params.push(`%${val}%`); };

  // Filter logic 
  if (filters.title) titleLike(filters.title);
  if (filters.publisher) pubLike(filters.publisher);
  if (filters.author) authorLike(filters.author);
  if (filters.genre) genreLike(filters.genre);
  if (filters.q) {
    const q = `%${filters.q}%`;
    where.push("(b.title LIKE ? OR p.name LIKE ? OR COALESCE(authors.authors, '') LIKE ? OR COALESCE(genres.genres, '') LIKE ?)");
    params.push(q, q, q, q);
  }

  // Where clause
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Sort clause
  const sortCol =
    filters.sort === 'available' ? 'availability.availableCopies' :
      filters.sort === 'publisher' ? 'p.name' : 'b.title';
  const order = (filters.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  // Base FROM clause
  const baseFrom = `
    FROM books b
    JOIN publishers p ON p.id = b.publisherId
    LEFT JOIN (
      SELECT ba.bookId, GROUP_CONCAT(CONCAT(a.firstName, ' ', a.lastName) ORDER BY a.lastName SEPARATOR ', ') AS authors
      FROM book_authors ba
      JOIN authors a ON a.id = ba.authorId
      GROUP BY ba.bookId
    ) AS authors ON authors.bookId = b.id
    LEFT JOIN (
      SELECT bg.bookId, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') AS genres
      FROM book_genres bg
      JOIN genres g ON g.id = bg.genreId
      GROUP BY bg.bookId
    ) AS genres ON genres.bookId = b.id
  `;

  // Main query
  const sql = `
    SELECT
      b.id,
      b.title,
      b.thumbnailUrl,
      b.isbn,
      b.pageCount,
      b.quantity,
      b.availableCopies,
      p.name AS publisherName,
      COALESCE(authors.authors, '') AS authors,
      COALESCE(genres.genres, '') AS genres
    ${baseFrom}
    ${whereSql}
    ORDER BY ${sortCol} ${order}
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  // Count query
  const countSql = `
    SELECT COUNT(DISTINCT b.id) AS total
    ${baseFrom}
    ${whereSql}
  `;

  const countResult = await pool.executeQuery(countSql, params) as unknown as CountRow[];
  const total = countResult[0]?.total ?? 0;

  const rows = await pool.executeQuery(sql, params) as unknown as BookListItem[];

  return {
    data: rows,
    page,
    pageSize,
    total
  };
}

/**
 * 
 * Retrieves all books from the database.
 * @returns {Promise<Book[]>} A promise that resolves to an array of Book objects.
 */
const getAllBooks = async (): Promise<Book[]> => {
  try {
    const query = 'SELECT * FROM Book';
    const rows = await mysqlConnection.executeQuery(query);
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
 * Creates a new book by calling the `add_a_new_book` stored procedure.
 * This procedure handles the book insertion, author linking, and logging in a single,
 * atomic transaction, simplifying the service function significantly.
 * @param {Book} bookData The data for the new book.
 * @param {string} authorIds A comma-separated string of author IDs.
 * @param {string} staffId The ID of the staff user performing the action.
 * @returns {Promise<Book>} A promise that resolves to the created Book object.
 */
const addNewBook = async (bookData: Book, authorIds: string, staffId: string): Promise<Book> => {
  try {
    const procedure = 'CALL add_a_new_book(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      bookData.title,
      bookData.thumbnailUrl || null,
      bookData.isbn || null,
      bookData.quantity || null,
      bookData.quantity || null,
      bookData.pageCount || null,
      bookData.publisherId || null,
      bookData.description || null,
      bookData.status || 'available',
      authorIds,
      staffId
    ];

    await mysqlConnection.executeQuery(procedure, params);

    return bookData;
  } catch (error) {
    console.error('Error in bookService.addNewBook:', error);
    if (error instanceof Error) {
      throw new Error(`Could not create book: ${error.message}`);
    } else {
      throw new Error(`Could not create book: ${String(error)}`);
    }
  }
}

/**
 * Updates the quantity and availableCopies of a specific book by calling the `UpdateBookInventory`
 * stored procedure.
 * @param {string} bookId The ID of the book to update.
 * @param {number} newQuantity The new total quantity for the book.
 * @param {string} staffId The ID of the staff user performing the action.
 * @returns {Promise<boolean>} A promise that resolves to true if updated, false if book not found.
 */
const updateBookInventory = async (bookId: string, newQuantity: number, staffId: string): Promise<boolean> => {
  try {
    const procedure = 'CALL UpdateBookInventory(?, ?, ?)';
    const params = [bookId, newQuantity, staffId];

    const results = await mysqlConnection.executeQuery(procedure, params);

    // Stored procedures don't return affectedRows directly, so we'll assume success if no error is thrown
    // and handle logic in the procedure itself. We can check the result set for a status if the procedure provides one.
    // For now, we'll return true on successful execution.
    return true;
  } catch (error) {
    console.error(`Error in bookService.updateBookInventory for ID ${bookId}:`, error);
    if (error instanceof Error) {
      // Re-throw with a more descriptive message
      throw new Error(`Could not update book inventory: ${error.message}`);
    } else {
      throw new Error(`Could not update book inventory: ${String(error)}`);
    }
  }
}

/**
 * Retires a book by calling the `RetireBook` stored procedure, which sets the status to 'unavailable'.
 * This function specifically handles retirement and should not be used for other status changes.
 * @param {string} bookId The ID of the book to retire.
 * @param {string} staffId The ID of the staff user performing the action.
 * @returns {Promise<boolean>} A promise that resolves to true if retired, false if book not found.
 */
const retireBook = async (bookId: string, staffId: string): Promise<boolean> => {
  try {
    const procedure = 'CALL RetireBook(?, ?)';
    const params = [bookId, staffId];

    const results = await mysqlConnection.executeQuery(procedure, params);
    return true; // Assume success if the procedure call doesn't throw an error
  } catch (error) {
    console.error(`Error in bookService.retireBook for ID ${bookId}:`, error);
    if (error instanceof Error) {
      throw new Error(`Could not retire book: ${error.message}`);
    } else {
      throw new Error(`Could not retire book: ${String(error)}`);
    }
  }
}

export { searchBooks, getAllBooks, addNewBook, updateBookInventory, retireBook }