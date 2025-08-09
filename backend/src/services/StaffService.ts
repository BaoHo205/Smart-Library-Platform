import mysql from '../database/mysql/connection';

const getMostBorrowedBooks = async (startDate: string, endDate: string) => {
  try {
    const query = `
            SELECT b.title, COUNT(b.id) AS total_checkouts
            FROM checkouts c
            JOIN books b ON c.bookId = b.id
            WHERE c.checkoutDate BETWEEN ? AND ?
            GROUP BY b.title
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

const getTopActiveReaders = async () => {
  try {
    const query = `
            SELECT CONCAT(u.firstName, ' ', u.lastName) AS reader_name,
	                 COUNT(c.userId) AS total_checkouts_by_user
            FROM checkouts c
            JOIN users u ON c.userId = u.id
            GROUP BY u.id, reader_name
            ORDER BY total_checkouts_by_user DESC;
        `;
    const result = await mysql.executeQuery(query);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get top active readers: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getBooksWithLowAvailability = async () => {
  try {
    const query = `
            SELECT b.title, b.quantity
            FROM books b
            WHERE b.quantity < 10
            ORDER BY b.quantity ASC;
        `;
    const result = await mysql.executeQuery(query);
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
