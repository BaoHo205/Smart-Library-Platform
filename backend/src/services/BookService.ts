import pool from '@/database/mysql/connection';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

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

export interface BookDetails {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  isbn: string;
  quantity: number;
  availableCopies: number;
  pageCount: number;
  publisherId: string;
  description: string | null;
  status: 'available' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
  publisherName: string;
}

export interface UserCheckout {
  id: string;
  userId: string;
  bookId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  isReturned: boolean;
  isLate: boolean;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  isbn: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface AvailabilityResult extends RowDataPacket {
  isAvailable: number;
}

interface BorrowBookOutput extends RowDataPacket {
  checkoutId: string | null;
  success: number;
  message: string;
}

type SqlParam = string | number;

export interface BookSearchResult {
  data: BookListItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface BorrowBookResult {
    success: boolean;
    message: string;
    checkoutId?: string;
}

async function searchBooks(filters: BookSearchFilters): Promise<BookSearchResult> {
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
    filters.sort === 'available' ? 'b.availableCopies' :
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

  const countResult = await pool.executeQuery(countSql, params) as CountRow[];
  const total = countResult[0]?.total ?? 0;

  const rows = await pool.executeQuery(sql, params) as BookListItem[];

  return {
    data: rows,
    page,
    pageSize,
    total
  };
}

const borrowBook = async (userId: string, bookId: string, dueDate: string): Promise<BorrowBookResult> => {
    try {
        // Convert string to MySQL date format (YYYY-MM-DD) and add 1 day
        const date = new Date(dueDate);
        
        // Call the stored procedure
        await pool.executeQuery(
            'CALL BorrowBook(?, ?, ?, @checkoutId, @success, @message)',
            [userId, bookId, date]
        );

        // Get the output parameters
        const outputResults = await pool.executeQuery(
            'SELECT @checkoutId as checkoutId, @success as success, @message as message'
      ) as BorrowBookOutput[];

        const output = outputResults[0];
        
        return {
            success: Boolean(output.success),
            message: output.message || 'Unknown error occurred',
            checkoutId: output.checkoutId || undefined
        };
    } catch (error) {
        console.error('Error in borrowBook service:', error);
        return {
            success: false,
            message: 'Failed to borrow book due to database error'
        };
    }
};

export const isBookAvailable = async (bookId: string): Promise<boolean> => {
    try {
        const results = await pool.executeQuery(
            'SELECT IsBookAvailable(?) as isAvailable',
            [bookId]
        ) as AvailabilityResult[];

        return Boolean(results[0]?.isAvailable);
    } catch (error) {
        console.error('Error checking book availability:', error);
        return false;
    }
};

const getBookById = async (bookId: string): Promise<BookDetails | null> => {
    try {
        const results = await pool.executeQuery(
            `SELECT b.*, p.name as publisherName 
             FROM books b 
             LEFT JOIN publishers p ON b.publisherId = p.id 
             WHERE b.id = ?`,
            [bookId]
        ) as BookDetails[];

        return results[0] || null;
    } catch (error) {
        console.error('Error getting book by ID:', error);
        return null;
    }
};

const getUserActiveCheckouts = async (userId: string): Promise<UserCheckout[]> => {
    try {
        const results = await pool.executeQuery(
            `SELECT c.*, b.title, b.isbn 
             FROM checkouts c 
             JOIN books b ON c.bookId = b.id 
             WHERE c.userId = ? AND c.isReturned = FALSE 
             ORDER BY c.dueDate ASC`,
            [userId]
        ) as UserCheckout[];

        return results;
    } catch (error) {
        console.error('Error getting user active checkouts:', error);
        return [];
    }
};

export default {
    searchBooks,
    borrowBook,
    isBookAvailable,
    getBookById,
    getUserActiveCheckouts
};