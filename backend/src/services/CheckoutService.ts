import pool from '../database/mysql/connection';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

export interface Checkout extends RowDataPacket {
  bookId: string;
  bookName: string;
  bookAuthors: string;
  bookGenres: string;
  copyId: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  isLate: boolean;
}

async function getAllCheckoutsByUserId(userId: string): Promise<Checkout[]> {
  const rows = (await pool.executeQuery(
    `SELECT 
      b.id AS bookId,
      b.title AS bookName,
      b.thumbnailUrl AS bookThumbnail,
      COALESCE(authors.authors, '') AS bookAuthors,
      COALESCE(genres.genres, '') AS bookGenres,
      bc.id AS copyId,
      c.checkoutDate,
      c.dueDate,
      c.returnDate,
      c.isReturned,
      c.isLate
    FROM checkouts c
    JOIN books_copies bc
    ON c.copyId = bc.id
    JOIN books b ON bc.bookId = b.id
    LEFT JOIN (
      SELECT 
        ba.bookId, 
        GROUP_CONCAT(CONCAT(a.firstName, ' ', a.lastName) ORDER BY a.lastName SEPARATOR ', ') AS authors
      FROM book_authors ba
      JOIN authors a ON a.id = ba.authorId
      GROUP BY ba.bookId
    ) AS authors ON authors.bookId = b.id
    LEFT JOIN (
      SELECT 
        bg.bookId, 
        GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') AS genres
      FROM book_genres bg
      JOIN genres g ON g.id = bg.genreId
      GROUP BY bg.bookId
    ) AS genres ON genres.bookId = b.id
    WHERE c.userId = ?
    ORDER BY c.checkoutDate DESC, c.dueDate ASC`,
    [userId]
  )) as Checkout[];
  return rows;
}

export { getAllCheckoutsByUserId };
