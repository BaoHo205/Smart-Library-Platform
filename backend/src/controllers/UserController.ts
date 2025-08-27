import { Request, Response } from 'express';
import UserService from '../services/UserService';
import JwtService from '../services/JwtServices';
import { AuthRequest } from '@/middleware/authMiddleware';
import { INewReviewData, IReviewData, IUpdateReviewData } from '@/types';
import { AppError } from '@/types/errors';

const getProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get user profile'
  // #swagger.description = 'Get current user profile information using JWT token.'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const token = req.cookies?.accessToken;

    // Verify token and get user ID
    const decoded = await JwtService.verifyAccessToken(token);
    const userId = decoded.userId;

    // Get user profile from database
    const userProfile = await UserService.getUserById(userId);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('Error getting user profile:', error);

    // Handle JWT-specific errors
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
        });
      }
      if (error.message.includes('Invalid')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const addReview = async (req: AuthRequest, res: Response): Promise<Response> => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Add book review'
  // #swagger.description = 'Add a review for a book. User must have borrowed and returned the book first.'

  const { bookId, rating, comment } = req.body;
  const userId = req.userId;

  // Basic input validation
  if (!userId || !bookId || rating === undefined || !comment) {
    return res.status(400).json({
      success: false,
      message: 'User ID, Book ID, rating, and comment are required',
    });
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer between 1 and 5',
    });
  }

  if (typeof comment !== 'string' || comment.trim().length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be at least 4 characters long',
    });
  }
  try {
    const reviewData: INewReviewData = {
      bookId: bookId.toString().trim(),
      rating: rating,
      comment: comment.toString().trim(),
      userId: userId, 
    };
    const result = await UserService.addReview(reviewData as IReviewData);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        reviewId: result.id
      }
    });

  } catch (error) {
    console.error('Error adding review:', error);

    console.error('Error adding review:', error);

    // Handle custom application errors
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

const updateReview = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Update book review'
  // #swagger.description = 'Update an existing book review by review ID. Requires user or staff authentication.'
  // #swagger.parameters['reviewId'] = { description: 'Review ID to update', type: 'string' }
  const reviewId = req.params.reviewId.trim();
  const { rating, comment } = req.body;
  const userId = req.userId;

  if (!reviewId || typeof reviewId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Review ID is required and must be a valid string',
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required for authorization',
    });
  }

  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating))) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer between 1 and 5',
    });
  }

  if (comment !== undefined && (typeof comment !== 'string' || comment.trim().length < 4)) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be at least 4 characters long',
    });
  }

  try {
    const updateData: IUpdateReviewData = {
      reviewId: reviewId,
      userId: userId, 
      rating: rating,
      comment: comment.toString(),
    };

    // Check if at least one field is provided
    if (updateData.rating === undefined && updateData.comment === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'At least rating or comment must be provided for update'
        }
      });
    }

    // Check for invalid rating parsing
    if (req.body.rating !== undefined && isNaN(updateData.rating!)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rating must be a valid number'
        }
      });
    }

    const result = await UserService.updateReview(updateData);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error updating review:', error);

    // Handle custom application errors
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get all users for search'
  // #swagger.description = 'Get all users for search and filtering purposes. Staff only.'
  try {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const searchUsers = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Search users'
  // #swagger.description = 'Search users by query string. Staff only.'
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    const users = await UserService.searchUsers(query);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default {
  addReview,
  updateReview,
  getProfile,
  getAllUsers,
  searchUsers,
};
