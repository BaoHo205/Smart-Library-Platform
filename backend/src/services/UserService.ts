import { v4 as uuidv4 } from 'uuid';
import mysql from '../database/mysql/connection';
import { RowDataPacket } from 'mysql2';
import { UserRole } from '@/types';

interface IReviewData {
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
}

interface IUpdateReviewData {
  bookId: string;
  userId: string;
  rating?: number;
  comment?: string;
}

interface UserProfile {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

interface CustomError extends Error {
  code?: string;
}

const createCustomError = (message: string, code: string): CustomError => {
  const error = new Error(message) as CustomError;
  error.code = code;
  return error;
};

const addReview = async (reviewData: IReviewData) => {
  try {
    if (!reviewData) {
      throw new Error('Review data is required');
    }

    // Check if book exists
    const existingBook = (await mysql.executeQuery(
      'SELECT * FROM books WHERE id = ?',
      [reviewData.bookId]
    )) as Array<{ bookId: string }>;
    
    if (!existingBook || existingBook.length === 0) {
      // Create a custom error for book not found
      const error = new Error('Book not found');
      (error as any).code = 'BOOK_NOT_FOUND';
      throw error;
    }

    // Check if user has borrowed this book
    const existingCheckout = (await mysql.executeQuery(
      'SELECT * FROM checkouts WHERE bookId = ? AND userId = ?',
      [reviewData.bookId, reviewData.userId]
    )) as Array<{ id: string }>;
    
    if (!existingCheckout || existingCheckout.length === 0) {
      // Create a custom error for permission denied
      const error = new Error('You can only review books you have borrowed');
      (error as any).code = 'PERMISSION_DENIED';
      throw error;
    }

    // Check if user has already reviewed this book
    const existingReview = (await mysql.executeQuery(
      'SELECT * FROM reviews WHERE bookId = ? AND userId = ?',
      [reviewData.bookId, reviewData.userId]
    )) as Array<{ id: string }>;
    
    if (existingReview && existingReview.length > 0) {
      const error = new Error('You have already reviewed this book');
      (error as any).code = 'REVIEW_EXISTS';
      throw error;
    }

    const reviewId = uuidv4();
    const create_at = new Date();
    const updated_at = new Date();
    const query = `
      INSERT INTO reviews (id, userId, bookId, rating, comment, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      reviewId,
      reviewData.userId,
      reviewData.bookId,
      reviewData.rating,
      reviewData.comment,
      create_at,
      updated_at,
    ];
    const res = await mysql.executeQuery(query, params);
    return { message: 'Review added successfully', res };
  } catch (error) {
    // Re-throw with the custom error code preserved
    throw error;
  }
};

const updateReview = async (
  reviewId: string,
  updateData: IUpdateReviewData
) => {
  try {
    const existingReview = (await mysql.executeQuery(
      'SELECT * FROM reviews WHERE id = ?',
      [reviewId]
    )) as Array<{ id: string }>;
    if (!existingReview || existingReview.length === 0) {
      throw new Error('User not found');
    }
    const updatedAt = new Date();
    const query = `
        UPDATE reviews
        SET rating = ?, comment = ?, updatedAt = ?
        WHERE id = ? AND userId = ?
        `;
    const params = [
      updateData.rating,
      updateData.comment,
      updatedAt,
      reviewId,
      updateData.userId,
    ];
    await mysql.executeQuery(query, params);

    const res = (await mysql.executeQuery(
      'SELECT * FROM reviews WHERE id = ?',
      [reviewId]
    )) as (IUpdateReviewData & RowDataPacket)[];

    return { message: 'Review added successfully', res: res[0] };
  } catch (error) {
    throw new Error(
      `Failed to add review: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    const query = `
      SELECT id, userName, firstName, lastName, email, role
      FROM users 
      WHERE id = ?
    `;

    const result = (await mysql.executeQuery(query, [userId])) as (UserProfile &
      RowDataPacket)[];

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error(
      `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default {
  addReview,
  updateReview,
  getUserById,
};
