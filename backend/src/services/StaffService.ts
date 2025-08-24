import mysql from '../database/mysql/connection';

const getMostBorrowedBooks = async (startDate: string, endDate: string) => {
  try {
    const query = `
      SELECT b.id, b.title, 
             GROUP_CONCAT(DISTINCT CONCAT(a.firstName, ' ', a.lastName) SEPARATOR ', ') as authors,
             COUNT(DISTINCT c.id) AS total_checkouts,
             b.availableCopies,
             b.quantity
      FROM checkouts c
      JOIN books b ON c.bookId = b.id
      LEFT JOIN book_authors ba ON b.id = ba.bookId
      LEFT JOIN authors a ON ba.authorId = a.id
      WHERE c.checkoutDate BETWEEN ? AND ?
      GROUP BY b.id, b.title, b.availableCopies, b.quantity
      ORDER BY total_checkouts DESC
      LIMIT 10;
    `;
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

const getBooksWithLowAvailability = async (interval: number) => {
  try {
    const query = `
            SELECT b.id, b.title, b.availableCopies, b.quantity,
                   ROUND((b.availableCopies / b.quantity) * 100, 2) AS availability_percentage,
                   COUNT(c.id) as recent_checkouts
            FROM books b
            LEFT JOIN checkouts c ON b.id = c.bookId 
              AND c.checkoutDate >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            WHERE (b.availableCopies / b.quantity) < 0.2   -- Less than 20% available
              OR b.availableCopies = 0
            GROUP BY b.id, b.title, b.availableCopies, b.quantity
            ORDER BY availability_percentage ASC, recent_checkouts DESC;
        `;
    const result = await mysql.executeQuery(query, interval);
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
