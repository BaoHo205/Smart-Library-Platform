import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../database/mysql/connection';
import e from 'express';

interface IReviewData {
    bookId: string;
    userId: string;
    rating: number;
    comment: string;
}

interface IUpdateReviewData {
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

        // const existingBook = await executeQuery(
        //     'SELECT * FROM books WHERE id = ?',
        //     [reviewData.book_id]
        // ) as Array<{ book_id: string }>;
        // if (!existingBook || existingBook.length === 0) {
        //     throw new Error('Book not found');
        // }

        const existingUser = await executeQuery(
            'SELECT * FROM users WHERE id = ?',
            [reviewData.userId]
        ) as Array<{ user_id: string }>;
        if (!existingUser || existingUser.length === 0) {
            throw new Error('User not found');
        }

        const reviewId = uuidv4();
        const create_at = new Date();
        const updated_at = new Date();
        const query = `
        INSERT INTO reviews (id, book_id, user_id, rating, comment, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            reviewId,
            reviewData.bookId,
            reviewData.userId,
            reviewData.rating,
            reviewData.comment,
            create_at,
            updated_at
        ]
        const res = await executeQuery(query, params);
        return { message: 'Review added successfully', res };
    } catch (error) {
        throw new Error(`Failed to add review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const updateReview = async (reviewId: string, updateData: IUpdateReviewData) => {
    try {

        // NOTE: Uncomment the following lines when the books table is available

        // const existingBook = await executeQuery(
        //     'SELECT * FROM books WHERE id = ?',
        //     [reviewData.book_id]
        // ) as Array<{ book_id: string }>;
        // if (!existingBook || existingBook.length === 0) {
        //     throw new Error('Book not found');
        // }
        const existingUser = await executeQuery(
            'SELECT * FROM users WHERE id = ?',
            [updateData.userId]
        ) as Array<{ id: string }>;
        if (!existingUser || existingUser.length === 0) {
            throw new Error('User not found');
        }
        console.log('Update review by user:', updateData.userId);
        console.log('Executing statement...');
        const existingReview = await executeQuery(
            'SELECT * FROM reviews WHERE id = ?',
            [reviewId]
        ) as Array<{ id: string }>;
        if (!existingReview || existingReview.length === 0) {
            throw new Error('User not found');
        }
        console.log('End of executing statement');
        console.log(existingReview);

        const updated_at = new Date();
        const query = `
        UPDATE reviews
        SET rating = ?, comment = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
        `;
        const params = [
            updateData.rating,
            updateData.comment,
            updated_at,
            reviewId,
            updateData.userId
        ]
        const res = await executeQuery(query, params);
        return { message: 'Review added successfully', res };
    } catch (error) {
        throw new Error(`Failed to add review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}




export default {
    addReview,
    updateReview,
};