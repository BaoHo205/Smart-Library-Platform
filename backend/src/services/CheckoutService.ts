import pool from '../database/mysql/connection';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

export interface Checkout extends RowDataPacket {
  bookId: string;
  bookName: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  isLate: boolean;
}

async function getAllCheckoutsByUserId(userId: string): Promise<Checkout[]> {
  const rows = (await pool.executeQuery(
    'SELECT b.id AS bookId, b.title AS bookName, c.checkoutDate, c.dueDate, c.returnDate, c.isReturned, c.isLate FROM checkouts c JOIN books b ON c.bookId = b.id WHERE c.userId = ?',
    [userId]
  )) as Checkout[];
  return rows;
}

export { getAllCheckoutsByUserId };
