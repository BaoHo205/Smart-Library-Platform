import mysql from '../database/mysql/connection';

const getBorrowCountInRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    const query = `SELECT CountBooksBorrowedInRange(?, ?) AS totalBorrowed;`;
    const rows = (await mysql.executeQuery(query, [startDate, endDate])) as
      | Array<{ totalBorrowed: number }>
      | unknown[];
    const totalBorrowed = (rows as Array<{ totalBorrowed: number }>)[0]
      ?.totalBorrowed;
    return { totalBorrowed: Number(totalBorrowed ?? 0) };
  } catch (error) {
    throw new Error(
      `Failed to get borrow count: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getMostBorrowedBooks = async (
  startDate: string,
  endDate: string,
  limit?: number | 'max',
  allTime: boolean = false
) => {
  try {
    let baseQuery: string;
    let params: any[];

    if (allTime) {
      // For all-time data, don't filter by date
      baseQuery = `
        SELECT b.id, b.title, 
               GROUP_CONCAT(DISTINCT CONCAT(a.firstName, ' ', a.lastName) SEPARATOR ', ') as authors,
               COUNT(DISTINCT c.id) AS total_checkouts,
               b.availableCopies,
               b.quantity
        FROM checkouts c
        JOIN books_copies bc ON c.copyId = bc.id
        JOIN books b ON bc.bookId = b.id
        LEFT JOIN book_authors ba ON b.id = ba.bookId
        LEFT JOIN authors a ON ba.authorId = a.id
        GROUP BY b.id, b.title, b.availableCopies, b.quantity
        ORDER BY total_checkouts DESC`;
      params = [];
    } else {
      // For time-based data, filter by date range
      baseQuery = `
        SELECT b.id, b.title, 
               GROUP_CONCAT(DISTINCT CONCAT(a.firstName, ' ', a.lastName) SEPARATOR ', ') as authors,
               COUNT(DISTINCT c.id) AS total_checkouts,
               b.availableCopies,
               b.quantity
        FROM checkouts c
        JOIN books_copies bc ON c.copyId = bc.id
        JOIN books b ON bc.bookId = b.id
        LEFT JOIN book_authors ba ON b.id = ba.bookId
        LEFT JOIN authors a ON ba.authorId = a.id
        WHERE c.checkoutDate BETWEEN ? AND ?
        GROUP BY b.id, b.title, b.availableCopies, b.quantity
        ORDER BY total_checkouts DESC`;
      params = [startDate, endDate];
    }

    // fetch all without LIMIT if limit is 'max' or not provided
    // if limit is a number, inject safe integer literal (some MySQL setups reject bound LIMIT params)
    const hasNumericLimit =
      typeof limit === 'number' && Number.isFinite(limit) && limit > 0;
    const safeLimit = hasNumericLimit ? Math.trunc(limit as number) : undefined;
    const query = hasNumericLimit
      ? `${baseQuery}\n      LIMIT ${safeLimit};`
      : `${baseQuery};`;

    const result = await mysql.executeQuery(query, params);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get most borrowed books: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getTopActiveReaders = async (
  monthsBack: number = 6,
  limit: string | 'max' = '10'
) => {
  try {
    const baseQuery = `
      SELECT CONCAT(u.firstName, ' ', u.lastName) AS reader_name,
             COUNT(DISTINCT c.id) AS total_checkouts,
             MAX(c.checkoutDate) as last_checkout_date
      FROM checkouts c
      JOIN users u ON c.userId = u.id
      WHERE c.checkoutDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY u.id, reader_name
      ORDER BY total_checkouts DESC`;

    // Add LIMIT only if it's a numeric value, not 'max'
    const hasNumericLimit =
      limit !== 'max' && !isNaN(parseInt(limit)) && parseInt(limit) > 0;
    const query = hasNumericLimit
      ? `${baseQuery}\n      LIMIT ${parseInt(limit)};`
      : `${baseQuery};`;

    const params = [monthsBack];
    const result = await mysql.executeQuery(query, params);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get top active readers: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getBooksWithLowAvailability = async (limit: number | 'max' = 5) => {
  try {
    let baseQuery: string;

    if (limit === 'max') {
      // for categories
      baseQuery = `
        SELECT b.id, b.title, b.availableCopies, b.quantity,
               ROUND((b.availableCopies / b.quantity) * 100, 2) AS availability_percentage,
               0 as recent_checkouts,
               CASE 
                 WHEN b.availableCopies = 0 THEN 'Out of Stock'
                 WHEN (b.availableCopies / b.quantity) <= 0.1 THEN 'Critical'
                 WHEN (b.availableCopies / b.quantity) <= 0.25 THEN 'Low'
                 WHEN (b.availableCopies / b.quantity) <= 0.5 THEN 'Moderate'
                 ELSE 'Good'
               END as availability_status
        FROM books b
        ORDER BY availability_percentage ASC`;
    } else {
      // for books list
      baseQuery = `
        SELECT b.id, b.title, b.availableCopies, b.quantity,
               ROUND((b.availableCopies / b.quantity) * 100, 2) AS availability_percentage,
               0 as recent_checkouts,
               CASE 
                 WHEN b.availableCopies = 0 THEN 'Out of Stock'
                 WHEN (b.availableCopies / b.quantity) <= 0.1 THEN 'Critical'
                 WHEN (b.availableCopies / b.quantity) <= 0.25 THEN 'Low'
                 WHEN (b.availableCopies / b.quantity) <= 0.5 THEN 'Moderate'
                 ELSE 'Good'
               END as availability_status
        FROM books b
        WHERE (b.availableCopies / b.quantity) < 0.5   -- Less than 50% available (more inclusive)
          OR b.availableCopies = 0
        ORDER BY availability_percentage ASC`;
    }

    // Apply limit if provided and valid, but not 'max'
    const hasNumericLimit =
      typeof limit === 'number' && Number.isFinite(limit) && limit > 0;
    const query = hasNumericLimit
      ? `${baseQuery}\n      LIMIT ${Math.trunc(limit)};`
      : `${baseQuery};`;

    const result = await mysql.executeQuery(query, []);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get books with low availability: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default {
  getMostBorrowedBooks,
  getTopActiveReaders,
  getBooksWithLowAvailability,
  getBorrowCountInRange,
};
