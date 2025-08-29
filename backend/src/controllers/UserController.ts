import { Request, Response } from 'express';
import UserService from '../services/UserService';
import JwtService from '../services/JwtServices';
import { AuthRequest } from '@/middleware/authMiddleware';
import { IReviewData } from '@/types';
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


const reviewBook = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Review book'
  // #swagger.description = 'Add or Update a review for a book. User must have borrowed and returned the book first.'
  
  const { bookId, rating, comment } = req.body;
  const userId = req.userId;


  try {
    const review: IReviewData = {
      bookId: bookId,
      userId: userId!, 
      rating: rating,
      comment: comment.toString(),
    };

    console.log('Review Data:', review);
    const result = await UserService.reviewBook(review);

    return res.status(200).json({
      success: result.success === 1,
      message: result.message,
      data: result.reviewId
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

export default {
  reviewBook,
  getProfile,
  getAllUsers,
  searchUsers,
};
