import mysql from '../database/mysql/connection';
import { IReviewResponse, UserRole } from '@/types';
import { IReviewData } from '@/types/index';
import {
  AppError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/types/errors';

interface UserProfile {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    const sql = `
      SELECT id, userName, firstName, lastName, email, role, createdAt, updatedAt
      FROM users
      WHERE id = ?
    `;

    const result = (await mysql.executeQuery(sql, [userId])) as UserProfile[];
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const sql = `
      SELECT id, userName, firstName, lastName, email, role, createdAt, updatedAt
      FROM users
      ORDER BY userName ASC
    `;

    const result = (await mysql.executeQuery(sql)) as UserProfile[];
    return result;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

const searchUsers = async (query: string): Promise<UserProfile[]> => {
  try {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT id, userName, firstName, lastName, email, role, createdAt, updatedAt
      FROM users
      WHERE userName LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR email LIKE ?
      ORDER BY userName ASC
    `;

    const result = (await mysql.executeQuery(sql, [
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
    ])) as UserProfile[];
    return result;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

const reviewBook = async (data: IReviewData): Promise<IReviewResponse> => {
  try {
    await mysql.executeQuery(
      'CALL ReviewBook(?, ?, ?, ?, @p_success, @p_message, @p_reviewId)',
      [data.userId, data.bookId, data.rating, data.comment.trim()]
    );

    // Get the output parameters
    const result = (await mysql.executeQuery(
      'SELECT @p_success as success, @p_message as message, @p_reviewId as reviewId'
    )) as IReviewResponse[];

    if (result[0].success == 0) {
      if (result[0].message == 'db error occurred while processing review') {
        throw new AppError(result[0].message, 500, 'DATABASE_PROCEDURE_ERROR');
      }
      if (result[0].message == 'You can only review books you have borrowed') {
        throw new ForbiddenError(result[0].message);
      }
      if (result[0].message.includes('not found')) {
        throw new NotFoundError(result[0].message);
      }
      if (
        result[0].message == 'Rating must be between 1 and 5' ||
        result[0].message == 'Comment must be at least 4 characters long'
      ) {
        throw new ValidationError(result[0].message);
      }
    }
    return result[0];
  } catch (error) {
    // AppError
    if (error instanceof AppError) {
      throw error;
    }
    // Handle database errors
    console.error('Database error in addReview:', error);
    throw new Error('Failed to add review due to database error');
  }
};

export default {
  reviewBook,
  getUserById,
  getAllUsers,
  searchUsers,
};
