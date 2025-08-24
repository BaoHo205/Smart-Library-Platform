import { Request, Response } from 'express';
import UserService from '../services/UserService';
import JwtService from '../services/JwtServices';
import { AuthRequest } from '@/middleware/authMiddleware';

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

const addReview = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Add book review'
  // #swagger.description = 'Add a review for a book. Requires user or staff authentication.'
  try {
    // Combine the request body with the userId from the authenticated request
    const reviewData = {
      ...req.body,
      userId: req.userId,
    };

    console.log('Received review data:', reviewData);
    if (!reviewData || Object.keys(reviewData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review data is required',
      });
    }
    console.log('Adding review with userId:', req.userId);

    const result = await UserService.addReview(reviewData);
    if (result) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.res,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to add review',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const updateReview = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Update book review'
  // #swagger.description = 'Update an existing book review by review ID. Requires user or staff authentication.'
  // #swagger.parameters['reviewId'] = { description: 'Review ID to update', type: 'string' }
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: 'Review ID is required',
      });
    }

    const updateData = {
      ...req.body,
      userId: req.userId,
    };
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Update data is required',
      });
    }

    const result = await UserService.updateReview(reviewId, updateData);
    if (result) {
      // console.log('Review updated successfully:', result.res);
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.res,
      });
    } else {
      // console.error('Failed to update review:', result);
      res.status(400).json({
        success: false,
        message: 'Failed to add review',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
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
