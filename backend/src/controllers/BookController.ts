import { Request, Response } from 'express';
import BookService from '../services/BookService';

const addReview = async (req: Request, res: Response) => {
    try {
        const reviewData = req.body;
        if (!reviewData || Object.keys(reviewData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Review data is required'
            });
        }
        console.log('Adding review:', req.body);

        const result = await BookService.addReview(reviewData);
        if (result) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.res
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to add review'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`
        });
        console.error('Error adding review:', error);
    }
}

const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId;
        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: 'Review ID is required'
            });
            console.error('Review ID is required');
        }

        const updateData = req.body;
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Update data is required'
            });
            console.error('Update data is required');
        }

        console.log('Update review with ID:', reviewId, 'Data:', updateData);

        const result = await BookService.updateReview(reviewId, updateData);
        if (result) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.res
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to add review'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`
        });
        console.error('Error updating review:', error);
    }
}
export default {
    addReview,
    updateReview
};