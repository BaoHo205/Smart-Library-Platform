import mysql from '../database/mysql/connection';

const getMostBorrowedBooks = async (
  startDate: string,
  endDate: string,
  limit?: number | 'max'
) => {
  try {
    const baseQuery = `
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

    // fetch all without LIMIT if limit is 'max' or not provided
    // if limit is a number, inject safe integer literal (some MySQL setups reject bound LIMIT params)
    const hasNumericLimit =
      typeof limit === 'number' && Number.isFinite(limit) && limit > 0;
    const safeLimit = hasNumericLimit ? Math.trunc(limit as number) : undefined;
    const query = hasNumericLimit
      ? `${baseQuery}\n      LIMIT ${safeLimit};`
      : `${baseQuery};`;
    const params = [startDate, endDate];

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
  limit: string = '10'
) => {
  try {
    const query = `
      SELECT CONCAT(u.firstName, ' ', u.lastName) AS reader_name,
             COUNT(DISTINCT c.id) AS total_checkouts,
             MAX(c.checkoutDate) as last_checkout_date
      FROM checkouts c
      JOIN users u ON c.userId = u.id
      WHERE c.checkoutDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY u.id, reader_name
      ORDER BY total_checkouts DESC
      LIMIT ?;
      
    `;
    const params = [monthsBack, limit];
    const result = await mysql.executeQuery(query, params);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get top active readers: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getBooksWithLowAvailability = async (limit: number = 5) => {
  try {
    const baseQuery = `
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

    // limit (build query)
    const hasNumericLimit = typeof limit === 'number' && Number.isFinite(limit) && limit > 0;
    const safeLimit = hasNumericLimit ? Math.trunc(limit as number) : 5;
    const query = `${baseQuery}\n      LIMIT ${safeLimit};`;

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
};
