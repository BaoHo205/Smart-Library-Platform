import pool from '../database/mysql/connection';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

export interface BookSearchFilters {
  q?: string; // general keyword -> title/publisher/author/genre
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
  avgRating: number | null;
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
  description: string | null;
  status: 'available' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
  avgRating: number;
  numberOfRatings: number;
  authors: string[];
  genres: string[];
  publisherName: string;
}

export interface ReviewWithUser {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  name: string;
}

// Raw database result type - extends BookDetails but overrides authors/genres as strings
type BookDetailsRaw = Omit<BookDetails, 'authors' | 'genres'> & {
  authors: string;
  genres: string;
} & RowDataPacket;

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

interface BorrowBookOutput extends RowDataPacket {
  checkoutId: string | null;
  success: number;
  message: string;
}

interface ReturnBookOutput extends RowDataPacket {
  success: number;
  message: string;
  isLate: number;
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

export interface ReturnBookResult {
  success: boolean;
  message: string;
  isLate?: boolean;
}

async function searchBooks(
  filters: BookSearchFilters
): Promise<BookSearchResult> {
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(filters.pageSize) || 10));
  const offset = (page - 1) * pageSize;

  // Define clause
  const where: string[] = [];
  const params: SqlParam[] = [];

  // Using COALESCE to avoid NULL in LIKE comparisons
  const titleLike = (val: string) => {
    where.push('b.title LIKE ?');
    params.push(`%${val}%`);
  };
  const pubLike = (val: string) => {
    where.push('p.name LIKE ?');
    params.push(`%${val}%`);
  };
  const authorLike = (val: string) => {
    where.push("COALESCE(authors.authors, '') LIKE ?");
    params.push(`%${val}%`);
  };
  const genreLike = (val: string) => {
    where.push("COALESCE(genres.genres, '') LIKE ?");
    params.push(`%${val}%`);
  };

  // Filter logic
  if (filters.title) titleLike(filters.title);
  if (filters.publisher) pubLike(filters.publisher);
  if (filters.author) authorLike(filters.author);
  if (filters.genre) genreLike(filters.genre);
  if (filters.q) {
    const q = `%${filters.q}%`;
    where.push(
      "(b.title LIKE ? OR p.name LIKE ? OR COALESCE(authors.authors, '') LIKE ? OR COALESCE(genres.genres, '') LIKE ?)"
    );
    params.push(q, q, q, q);
  }

  // Where clause
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Sort clause
  const sortCol =
    filters.sort === 'available'
      ? 'b.availableCopies'
      : filters.sort === 'publisher'
        ? 'p.name'
        : 'b.title';
  const order =
    (filters.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

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
      b.avgRating,
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

  const countResult = (await pool.executeQuery(countSql, params)) as CountRow[];
  const total = countResult[0]?.total ?? 0;

  const rows = (await pool.executeQuery(sql, params)) as BookListItem[];

  return {
    data: rows,
    page,
    pageSize,
    total,
  };
}

const borrowBook = async (
  userId: string,
  bookId: string,
  dueDate: string
): Promise<BorrowBookResult> => {
  try {
    // Convert string to MySQL date format (YYYY-MM-DD) and add 1 day
    const date = new Date(dueDate);

    // Call the stored procedure
    await pool.executeQuery(
      'CALL BorrowBook(?, ?, ?, @checkoutId, @success, @message)',
      [userId, bookId, date]
    );

    // Get the output parameters
    const outputResults = (await pool.executeQuery(
      'SELECT @checkoutId as checkoutId, @success as success, @message as message'
    )) as BorrowBookOutput[];

    const output = outputResults[0];

    return {
      success: Boolean(output.success),
      message: output.message || 'Unknown error occurred',
      checkoutId: output.checkoutId || undefined,
    };
  } catch (error) {
    console.error('Error in borrowBook service:', error);
    return {
      success: false,
      message: 'Failed to borrow book due to database error',
    };
  }
};

export const returnBook = async (
  userId: string,
  bookId: string
): Promise<ReturnBookResult> => {
  try {
    // Call the stored procedure
    await pool.executeQuery(
      `
            CALL ReturnBook(?, ?, @p_success, @p_message, @p_isLate)
        `,
      [userId, bookId]
    );

    // Get the output parameters
    const outputResults = (await pool.executeQuery(`
            SELECT @p_success as success, @p_message as message, @p_isLate as isLate
        `)) as ReturnBookOutput[];

    const output = outputResults[0];

    return {
      success: Boolean(output.success),
      message: output.message,
      isLate: Boolean(output.isLate),
    };
  } catch (error) {
    console.error('Error in borrowBook service:', error);
    return {
      success: false,
      message: 'Failed to return book due to database error',
    };
  }
};

const getBookInfoById = async (bookId: string): Promise<BookDetails | null> => {
  try {
    const sql = `
      SELECT 
        b.id,
        b.title,
        b.thumbnailUrl,
        b.isbn,
        b.quantity,
        b.availableCopies,
        b.pageCount,
        b.description,
        CASE 
          WHEN b.availableCopies > 0 THEN 'available'
          ELSE 'unavailable'
        END AS status,
        b.createdAt,
        b.updatedAt,
        p.name AS publisherName,
        COALESCE(authors.authors, '') AS authors,
        COALESCE(genres.genres, '') AS genres,
        COALESCE(b.avgRating, 0) AS avgRating,
        COALESCE(reviews.numberOfRatings, 0) AS numberOfRatings
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
      LEFT JOIN (
        SELECT 
          r.bookId,
          COUNT(r.id) AS numberOfRatings
        FROM reviews r
        GROUP BY r.bookId
      ) AS reviews ON reviews.bookId = b.id
      WHERE b.id = ?
    `;

    const results = (await pool.executeQuery(sql, [
      bookId,
    ])) as BookDetailsRaw[];

    if (results.length === 0) {
      return null;
    }

    const book = results[0];

    // Convert authors and genres from comma-separated strings to arrays
    const bookDetails: BookDetails = {
      ...book,
      authors: book.authors
        ? book.authors
            .split(', ')
            .filter((author: string) => author.trim() !== '')
        : [],
      genres: book.genres
        ? book.genres.split(', ').filter((genre: string) => genre.trim() !== '')
        : [],
      avgRating: Number(book.avgRating) || 0,
      numberOfRatings: Number(book.numberOfRatings) || 0,
    };

    return bookDetails;
  } catch (error) {
    console.error('Error getting book by ID:', error);
    return null;
  }
};

const getAllReviewsByBookId = async (
  bookId: string
): Promise<ReviewWithUser[]> => {
  try {
    const sql = `
      SELECT 
        r.id,
        r.userId,
        r.bookId,
        r.rating,
        r.comment,
        r.createdAt,
        r.updatedAt,
        u.userName,
        CONCAT(u.firstName, ' ', u.lastName) AS name
      FROM reviews r
      JOIN users u ON u.id = r.userId
      WHERE r.bookId = ?
      ORDER BY r.updatedAt DESC
    `;

    const results = (await pool.executeQuery(sql, [
      bookId,
    ])) as (ReviewWithUser & RowDataPacket)[];

    return results;
  } catch (error) {
    console.error('Error getting reviews by book ID:', error);
    return [];
  }
};

const isBookBorrowed = async (
  bookId: string,
  userId: string
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM checkouts
      WHERE bookId = ? AND userId = ? AND returnDate IS NULL
    `;

    const result = (await pool.executeQuery(query, [
      bookId,
      userId,
    ])) as (boolean & RowDataPacket)[];
    const isBookBorrowed = result[0].count > 0;
    return isBookBorrowed;
  } catch (error) {
    console.error('Error checking if book is borrowed:', error);
    return false;
  }
};

export default {
  searchBooks,
  borrowBook,
  returnBook,
  getBookInfoById,
  getAllReviewsByBookId,
  isBookBorrowed,
};
