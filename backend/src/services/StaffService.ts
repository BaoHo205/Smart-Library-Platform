import { executeQuery } from "../database/mysql/connection";

const getMostBorrowedBooks = async (startDate: string, endDate: string) => {
    try {
        const query = `
            SELECT b.title, COUNT(b.id) AS total_checkouts
            FROM Checkout c
            JOIN Books b ON c.book_id = b.id
            WHERE c.checkout_date BETWEEN ? AND ?
            GROUP BY b.title
            ORDER BY total_checkouts DESC
            LIMIT 10;
        `;
        const params = [startDate, endDate];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        throw new Error(`Failed to get most borrowed books: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const getTopActiveReaders = async () => {
    try {
        const query = `
            SELECT CONCAT(u.first_name, ' ', u.last_name) AS reader_name,
            COUNT (c.user_id) AS total_checkouts_by_user
            FROM Checkout c
            JOIN User u ON c.user_id = u.id
            GROUP BY u.id, reader_name
            ORDER BY total_checkouts_by_user DESC;
        `;
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        throw new Error(`Failed to get top active readers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const getBooksWithLowAvailability = async () => {
    try {
        const query = `
            SELECT b.title, b.quantity
            FROM Books b
            WHERE b.quantity < 5
            ORDER BY b.quantity ASC;
        `;
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        throw new Error(`Failed to get books with low availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
export default {
    getMostBorrowedBooks,
    getTopActiveReaders,
    getBooksWithLowAvailability
}