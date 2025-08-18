import { Request, Response } from 'express';
import UserService from '../services/UserService';
import JwtService from '../services/JwtServices';

const getProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get user profile'
  // #swagger.description = 'Get current user profile information using JWT token.'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
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

const addReview = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Add book review'
  // #swagger.description = 'Add a review for a book. Requires user or staff authentication.'
  try {
    const reviewData = req.body;
    if (!reviewData || Object.keys(reviewData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review data is required',
      });
    }
    console.log('Adding review:', req.body);

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

const updateReview = async (req: Request, res: Response) => {
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

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Update data is required',
      });
    }

    console.log('Update review with ID:', reviewId, 'Data:', updateData);

    const result = await UserService.updateReview(reviewId, updateData);
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

export default {
  addReview,
  updateReview,
  getProfile,
};
