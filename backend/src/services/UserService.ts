import { v4 as uuidv4 } from 'uuid';
import mysql from '../database/mysql/connection';
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

const addReview = async (reviewData: IReviewData) => {
  try {
    if (!reviewData) {
      throw new Error('Review data is required');
    }

    // NOTE: Uncomment the following lines when the books table is available

    const existingBook = (await mysql.executeQuery(
      'SELECT * FROM books WHERE id = ?',
      [reviewData.bookId]
    )) as Array<{ bookId: string }>;
    if (!existingBook || existingBook.length === 0) {
      throw new Error('Book not found');
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
    throw new Error(
      `Failed to add review: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const updateReview = async (
  reviewId: string,
  updateData: IUpdateReviewData
) => {
  try {
    console.log('Update review by user:', updateData.userId);
    const existingReview = (await mysql.executeQuery(
      'SELECT * FROM reviews WHERE id = ?',
      [reviewId]
    )) as Array<{ id: string }>;
    if (!existingReview || existingReview.length === 0) {
      throw new Error('User not found');
    }

    console.log(existingReview);

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
    const res = await mysql.executeQuery(query, params);
    return { message: 'Review added successfully', res };
  } catch (error) {
    throw new Error(
      `Failed to add review: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default {
  addReview,
  updateReview,
};
