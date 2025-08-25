import { v4 as uuidv4 } from 'uuid';
import mysql from '../database/mysql/connection';
import { ResultSetHeader } from 'mysql2';
import { IUpdateReviewData, IUpdateReviewResponse, UserRole } from '@/types';
import { IReviewData } from '@/types/index';
import { AppError, ForbiddenError, NotFoundError, ValidationError } from '@/types/errors';


interface UserProfile {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// Helper functions for review operations
const createReview = async (reviewData: IReviewData): Promise<string> => {
  const reviewId = uuidv4();
  const now = new Date();

  const query = `
    INSERT INTO reviews (id, userId, bookId, rating, comment, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    reviewId,
    reviewData.userId,
    reviewData.bookId,
    reviewData.rating,
    reviewData.comment.trim(),
    now,
    now,
  ];

  await mysql.executeQuery(query, params);
  return reviewId;
};

const performReviewUpdate = async (updateData: IUpdateReviewData): Promise<IUpdateReviewResponse> => {
  const updatedAt = new Date();
  
  // Build dynamic query based on provided fields
  const updateFields: string[] = [];
  const params: unknown[] = [];

  if (updateData.rating !== undefined) {
    updateFields.push('rating = ?');
    params.push(updateData.rating);
  }

  if (updateData.comment !== undefined) {
    updateFields.push('comment = ?');
    params.push(updateData.comment.trim());
  }

  updateFields.push('updatedAt = ?');
  params.push(updatedAt);

  // Add WHERE conditions
  params.push(updateData.reviewId);
  params.push(updateData.userId);

  const query = `
    UPDATE reviews 
    SET ${updateFields.join(', ')}
    WHERE id = ? AND userId = ?
  `;

  const result = await mysql.executeQuery(query, params) as ResultSetHeader;

  // Check if any row was actually updated
  if (result.affectedRows === 0) {
    throw new ForbiddenError('Unable to update review. You can only update your own reviews.');
  }

  // Fetch and return updated review
  const updatedReview = await mysql.executeQuery(
    'SELECT id, rating, comment FROM reviews WHERE id = ?',
    [updateData.reviewId]
  ) as Array<{ id: string; rating: number; comment: string }>;

  return updatedReview[0];
};

// Helper functions for validations
const validateBookExists = async (bookId: string): Promise<void> => {
  const existingBook = await mysql.executeQuery(
    'SELECT id FROM books WHERE id = ?',
    [bookId]
  ) as Array<{ id: string }>;

  if (!existingBook || existingBook.length === 0) {
    throw new NotFoundError('Book not found');
  }
};

const validateUserCanReview = async (userId: string, bookId: string): Promise<void> => {
  const existingCheckout = await mysql.executeQuery(
    `SELECT c.id 
     FROM checkouts c 
     JOIN books_copies bc 
      ON c.copyId = bc.id 
     WHERE userId = ? AND bookId = ? AND  isReturned = 1; 
    `,
    [userId, bookId]
  ) as Array<{ id: string }>;

  if (!existingCheckout || existingCheckout.length === 0) {
    throw new ForbiddenError('You can only review books you have borrowed and returned');
  }
};

const validateReviewExists = async (reviewId: string): Promise<void> => {
  const existingReview = await mysql.executeQuery(
    'SELECT id  FROM reviews WHERE id = ?',
    [reviewId]
  ) as Array<{ id: string }>;

  if (!existingReview || existingReview.length === 0) {
    throw new NotFoundError('Review not found');
  }
};

const validateReviewOwnership = (review: IUpdateReviewData, userId: string): void => {
  if (review.userId !== userId) {
    throw new ForbiddenError('You can only update your own reviews');
  }
};

// Add a new review
const addReview = async (reviewData: IReviewData): Promise<{
  id: string;
  message: string;
}> => {
  // Validate input data
  if (!reviewData?.userId || !reviewData?.bookId || !reviewData?.rating || !reviewData?.comment) {
    throw new ValidationError('User ID, Book ID, rating, and comment are required');
  }

  // Validate rating range
  if (reviewData.rating < 1 || reviewData.rating > 5 || !Number.isInteger(reviewData.rating)) {
    throw new ValidationError('Rating must be an integer between 1 and 5');
  }

  // Validate comment length
  if (reviewData.comment.trim().length < 10) {
    throw new ValidationError('Comment must be at least 10 characters long');
  }

  try {
    // check if book exists
    await validateBookExists(reviewData.bookId);

    // check if user can add review
    await validateUserCanReview(reviewData.userId, reviewData.bookId);


    // Create the review
    const reviewId = await createReview(reviewData);

    return {
      id: reviewId,
      message: 'Review added successfully'
    };
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle database errors
    console.error('Database error in addReview:', error);
    throw new Error('Failed to add review due to database error');
  }
};

// Update an existing review
const updateReview = async ( updateData: IUpdateReviewData ) => {
  // Validate input parameters
  if (!updateData || typeof updateData !== 'object') {
    throw new ValidationError('Update data is required');
  }

  if (!updateData.reviewId || typeof updateData.reviewId !== 'string') {
    throw new ValidationError('Review ID is required and must be a valid string');
  }

  if (!updateData.userId) {
    throw new ValidationError('User ID is required for authorization');
  }
  try {
    // Check if the review exists
    await validateReviewExists(updateData.reviewId);

    // check if the user is the owner of the review
    validateReviewOwnership(updateData, updateData.userId);

    const updatedReview = await performReviewUpdate(updateData);

    return {
      message: 'Review updated successfully',
      data: updatedReview
    };
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof AppError) {
      throw error;
    }

    // Handle database errors
    console.error('Database error in updateReview:', error);
    throw new Error('Failed to update review due to database error');
  }
};

const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    const sql = `
      SELECT id, userName, firstName, lastName, email, role, createdAt, updatedAt
      FROM users
      WHERE id = ?
    `;

    const result = await mysql.executeQuery(sql, [userId]) as UserProfile[];
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

    const result = await mysql.executeQuery(sql) as UserProfile[];
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

    const result = await mysql.executeQuery(sql, [searchTerm, searchTerm, searchTerm, searchTerm]) as UserProfile[];
    return result;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export default {
  addReview,
  updateReview,
  getUserById,
  getAllUsers,
  searchUsers,
};
