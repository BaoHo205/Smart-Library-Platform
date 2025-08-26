import { NewBook } from '@/controllers/BookController';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import mysqlConnection from '@/database/mysql/connection';
import { Book } from '@/models/mysql/Book';

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
  let page = 1;
  let pageSize = 10;
  let offset = 0;
  let paginationSql = '';

  // Only apply pagination if page or pageSize are provided by the user.
  if (filters.page || filters.pageSize) {
    page = Math.max(1, Number(filters.page) || 1);
    pageSize = Math.min(100, Math.max(1, Number(filters.pageSize) || 10));
    offset = (page - 1) * pageSize;
    paginationSql = `LIMIT ${pageSize} OFFSET ${offset}`;
  }

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
      b.description,
      b.isRetired,
      p.name AS publisherName,
      COALESCE(authors.authors, '') AS authors,
      COALESCE(genres.genres, '') AS genres
    ${baseFrom}
    ${whereSql}
    ORDER BY ${sortCol} ${order}
    ${paginationSql}
  `;

  // Count query
  const countSql = `
    SELECT COUNT(DISTINCT b.id) AS total
    ${baseFrom}
    ${whereSql}
  `;

  const countResult = (await mysqlConnection.executeQuery(countSql, params)) as CountRow[];
  const total = countResult[0]?.total ?? 0;

  const rows = (await mysqlConnection.executeQuery(sql, params)) as BookListItem[];

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
    await mysqlConnection.executeQuery(
      'CALL BorrowBook(?, ?, ?, @checkoutId, @success, @message)',
      [userId, bookId, date]
    );

    // Get the output parameters
    const outputResults = (await mysqlConnection.executeQuery(
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

const returnBook = async (
  userId: string,
  bookId: string
): Promise<ReturnBookResult> => {
  try {
    // Call the stored procedure
    await mysqlConnection.executeQuery(
      `
            CALL ReturnBook(?, ?, @p_success, @p_message, @p_isLate)
        `,
      [userId, bookId]
    );

    // Get the output parameters
    const outputResults = (await mysqlConnection.executeQuery(`
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
          COUNT(r.id) AS numberOfRatings,
          AVG(r.rating) AS avgRating
        FROM reviews r
        GROUP BY r.bookId
      ) AS reviews ON reviews.bookId = b.id
      WHERE b.id = ?
    `;

    const results = (await mysqlConnection.executeQuery(sql, [
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
};

interface IdRow {
  id: string;
}

/**
 * Creates a new book by calling the `AddNewBook` stored procedure.
 * This procedure handles the book insertion, author and genre linking, and logging in a single,
 * atomic transaction, simplifying the service function significantly.
 * @param {NewBook} bookData The data for the new book.
 * @param {string} staffId The ID of the staff user performing the action.
 * @returns {Promise<String>} A promise that resolves to the created Book object id.
 */
const addNewBook = async (
  bookData: NewBook,
  staffId: string
): Promise<string> => {
  try {
    const procedure =
      'CALL AddNewBook(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @new_book_id)';
    const params = [
      bookData.title,
      bookData.thumbnailUrl || null,
      bookData.isbn || null,
      bookData.quantity || null,
      bookData.quantity || null,
      bookData.pageCount || 500,
      bookData.publisherId || null,
      bookData.description || null,
      bookData.avgRating,
      bookData.authorIds,
      bookData.genreIds,
      staffId,
    ];

    // Execute the stored procedure (returns OkPacket or similar)
    await mysqlConnection.executeQuery(procedure, params);

    // Retrieve the OUT parameter
    const result = (await mysqlConnection.executeQuery(
      'SELECT @new_book_id AS id'
    )) as unknown as IdRow;

    if (!result) {
      throw new Error('Failed to retrieve new book ID from procedure');
    }

    console.log(result.id)

    const book = await getBookInfoById(result.id);
    console.log(book)

    return result.id;
  } catch (error) {
    console.error('Error in bookService.addNewBook:', error);
    if (error instanceof Error) {
      throw new Error(`Could not create book: ${error.message}`);
    } else {
      throw new Error(`Could not create book: ${String(error)}`);
    }
  }
};

const addNewCopy = async (
  bookId: string,
  staffId: string
): Promise<BookCopy> => {
  try {
    const procedure =
      'CALL AddBookCopy(?, ?, @new_copy_id)';
    const params = [
      bookId,
      staffId
    ];

    // Execute the stored procedure (returns OkPacket or similar)
    await mysqlConnection.executeQuery(procedure, params);

    // Retrieve the OUT parameter
    const result = (await mysqlConnection.executeQuery(
      'SELECT @new_copy_id AS id'
    )) as unknown as IdRow[];

    if (!result) {
      throw new Error('Failed to retrieve new book ID from procedure');
    }

    console.log(result[0].id)

    const book = await getBookCopyById(result[0].id);
    console.log(book)

    return book;
  } catch (error) {
    console.error('Error in bookService.addNewCopy:', error);
    if (error instanceof Error) {
      throw new Error(`Could not create book copy: ${error.message}`);
    } else {
      throw new Error(`Could not create book copy: ${String(error)}`);
    }
  }
};
interface BookCopy {
  id: string;
  isBorrowed: number
}
const getBookCopyById = async (id: string) => {
  try {
    const query = 'SELECT id, isBorrowed FROM books_copies WHERE id = ?';
    const result = await mysqlConnection.executeQuery(query, [id]) as unknown as BookCopy[];
    return result[0];
  } catch (error) {
    console.error('Error in bookService.getBookCopyById:', error);
    if (error instanceof Error) {
      throw new Error(`Could not get book copy: ${error.message}`);
    } else {
      throw new Error(`Could not get book copy: ${String(error)}`);
    }
  }
}

const deleteBookCopyById = async (copyId: string, staffId: string) => {
  try {
    const query = 'CALL DeleteBookCopy(?, ?)';
    await mysqlConnection.executeQuery(query, [copyId, staffId]);
    return true;
  } catch (error) {
    console.error('Error in bookService.getBookCopyById:', error);
    if (error instanceof Error) {
      throw new Error(`Could not get book copy: ${error.message}`);
    } else {
      throw new Error(`Could not get book copy: ${String(error)}`);
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
const updateBookInventory = async (
  bookId: string,
  newQuantity: number,
  staffId: string
): Promise<boolean> => {
  try {
    const procedure = 'CALL UpdateBookInventory(?, ?, ?)';
    const params = [bookId, newQuantity, staffId];

    const results = await mysqlConnection.executeQuery(procedure, params);

    return true;
  } catch (error) {
    console.error(
      `Error in bookService.updateBookInventory for ID ${bookId}:`,
      error
    );
    if (error instanceof Error) {
      // Re-throw with a more descriptive message
      throw new Error(`Could not update book inventory: ${error.message}`);
    } else {
      throw new Error(`Could not update book inventory: ${String(error)}`);
    }
  }
};

/**
 * Retires a book by calling the `RetireBook` stored procedure, which sets the status to 'unavailable'.
 * This function specifically handles retirement and should not be used for other status changes.
 * @param {string} bookId The ID of the book to retire.
 * @param {string} staffId The ID of the staff user performing the action.
 * @returns {Promise<boolean>} A promise that resolves to true if retired, false if book not found.
 */
const retireBook = async (
  bookId: string,
  staffId: string
): Promise<boolean> => {
  try {
    const procedure = 'CALL RetireBook(?, ?)';
    const params = [bookId, staffId];

    const results = await mysqlConnection.executeQuery(procedure, params);
    return true;
  } catch (error) {
    console.error(`Error in bookService.retireBook for ID ${bookId}:`, error);
    if (error instanceof Error) {
      throw new Error(`Could not retire book: ${error.message}`);
    } else {
      throw new Error(`Could not retire book: ${String(error)}`);
    }
  }
};

const retireCopy = async (
  bookId: string,
  staffId: string
): Promise<boolean> => {
  try {
    const procedure = 'CALL RetireBookCopy(?, ?)';
    const params = [bookId, staffId];

    const results = await mysqlConnection.executeQuery(procedure, params);
    return true;
  } catch (error) {
    console.error(`Error in bookService.retireCopy for CopyID ${bookId}:`, error);
    if (error instanceof Error) {
      throw new Error(`Could not retire copy: ${error.message}`);
    } else {
      throw new Error(`Could not retire copy: ${String(error)}`);
    }
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

    const results = (await mysqlConnection.executeQuery(sql, [
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

    const result = (await mysqlConnection.executeQuery(query, [
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

const updateBook = async (
  bookData: NewBook,
  bookId: string,
  staffId: string
): Promise<void> => {
  try {
    const query = `
            CALL UpdateBook(
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            );
        `;

    // The array of parameters must be in the exact order the stored procedure expects.
    const params = [
      bookId,
      bookData.title || null,
      bookData.thumbnailUrl || null,
      bookData.isbn || null,
      bookData.quantity || null,
      bookData.pageCount || null,
      bookData.publisherId || null,
      bookData.description || null,
      bookData.avgRating,
      bookData.authorIds,
      bookData.genreIds,
      staffId
    ];

    // The `executeQuery` function handles connection pooling and prepared statements for us.
    await mysqlConnection.executeQuery(query, params);

    console.log(`Book with ID ${bookData} updated successfully.`);
  } catch (error) {
    console.error('Error in BookService.updateBook:', error);
    throw new Error('Failed to update book in the database.');
  }
};

interface BookCopiesRow {
  id: string;
  isBorrowed: number;
}

const getBookCopies = async (bookId: string) => {
  const query = `
    SELECT id, isBorrowed
    FROM books_copies
    WHERE bookId = ?
  `

  const param = [bookId]

  try {
    const result = await mysqlConnection.executeQuery(query, param) as unknown as BookCopiesRow;
    return result;
  } catch (error) {
    console.error('Error in BookService.getBookCopies:', error);
    throw new Error('Failed to get book copies in the database.');
  }
}

export default {
  searchBooks,
  borrowBook,
  returnBook,
  getBookInfoById,
  getAllBooks,
  addNewBook,
  updateBookInventory,
  retireBook,
  getAllReviewsByBookId,
  isBookBorrowed,
  updateBook,
  getBookCopies,
  retireCopy,
  deleteBookCopyById,
  addNewCopy
};
