import { Request, Response } from 'express';
import * as readingSessionService from '../services/ReadingSessionService';
import { DeviceType } from '../models/mongodb/enum/DeviceType';
import { Highlight } from '../models/mongodb/ReadingSession';

// POST /api/reading/start - Start a new reading session
export const startReadingSession = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Start a new reading session'
  // #swagger.description = 'Initialize a new reading session for a user with a specific book and device'
  // #swagger.requestBody = { required: true, content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' }, bookId: { type: 'string' }, device: { type: 'string', enum: ['mobile', 'tablet', 'desktop'] } }, required: ['userId', 'bookId', 'device'] } } } }
  try {
    const { userId, bookId, device } = req.body;

    if (!userId || !bookId || !device) {
      return res.status(400).json({
        success: false,
        message: 'userId, bookId, and device are required',
      });
    }

    if (!Object.values(DeviceType).includes(device)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid device type. Must be mobile, tablet, or desktop nhe ban :>',
      });
    }

    const session = await readingSessionService.startReadingSession(
      userId,
      bookId,
      device as DeviceType
    );

    res.status(201).json({
      success: true,
      data: session,
      message: 'Reading session started successfully',
    });
  } catch (error) {
    console.error('Error starting reading session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// POST /api/reading/end/:sessionId - End a reading session
export const endReadingSession = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'End a reading session'
  // #swagger.description = 'Complete and finalize a reading session by session ID'
  // #swagger.parameters['sessionId'] = { description: 'Reading session ID to end', type: 'string' }
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    const session = await readingSessionService.endReadingSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Reading session not found',
      });
    }

    res.json({
      success: true,
      data: session,
      message: 'Reading session ended successfully',
    });
  } catch (error) {
    console.error('Error ending reading session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/avg-time: Get average session time per user
export const getAverageSessionTime = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get average reading session time'
  // #swagger.description = 'Retrieve analytics data showing average reading session duration per user'
  try {
    const result = await readingSessionService.getAverageSessionTime();

    res.json({
      success: true,
      data: result,
      message: 'Average session time retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting average session time:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/most-highlighted - Get most highlighted books
export const getMostHighlightedBooks = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get most highlighted books'
  // #swagger.description = 'Retrieve books with the highest number of highlights from reading sessions'
  // #swagger.parameters['limit'] = { description: 'Number of books to return (default: 5)', type: 'integer', in: 'query' }
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const result = await readingSessionService.getMostHighlightedBooks(limit);

    res.json({
      success: true,
      data: result,
      message: 'Most highlighted books retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting most highlighted books:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/top-books-time - Get top books by reading time
export const getTopBooksByReadTime = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get top books by reading time'
  // #swagger.description = 'Retrieve books ranked by total reading time across all users'
  // #swagger.parameters['limit'] = { description: 'Number of books to return (default: 10)', type: 'integer', in: 'query' }
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await readingSessionService.getTopBooksByReadTime(limit);

    res.json({
      success: true,
      data: result,
      message: 'Top books by reading time retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting top books by reading time:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// POST /api/reading/:sessionId/pages - Add pages read to session
export const addPagesRead = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Add pages read to session'
  // #swagger.description = 'Track pages read during an active reading session'
  // #swagger.parameters['sessionId'] = { description: 'Reading session ID', type: 'string' }
  // #swagger.requestBody = { required: true, content: { 'application/json': { schema: { type: 'object', properties: { pages: { type: 'array', items: { type: 'integer' } } }, required: ['pages'] } } } }
  try {
    const { sessionId } = req.params;
    const { pages } = req.body;

    if (!sessionId || !pages || !Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and pages array are required',
      });
    }

    const session = await readingSessionService.addPagesRead(sessionId, pages);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Reading session not found',
      });
    }

    res.json({
      success: true,
      data: session,
      message: 'Pages read added successfully',
    });
  } catch (error) {
    console.error('Error adding pages read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// POST /api/reading/:sessionId/highlights - Add highlight to session
export const addHighlight = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Add highlight to session'
  // #swagger.description = 'Add a text highlight to an active reading session'
  // #swagger.parameters['sessionId'] = { description: 'Reading session ID', type: 'string' }
  // #swagger.requestBody = { required: true, content: { 'application/json': { schema: { type: 'object', properties: { pageNumber: { type: 'integer' }, text: { type: 'string' } }, required: ['pageNumber', 'text'] } } } }
  try {
    const { sessionId } = req.params;
    const { pageNumber, text } = req.body;

    if (!sessionId || !pageNumber || !text) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, page number, and text are required',
      });
    }

    const highlight: Highlight = {
      pageNumber,
      text,
      timestamp: new Date(),
    };

    const session = await readingSessionService.addHighlight(
      sessionId,
      highlight
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Reading session not found',
      });
    }

    res.json({
      success: true,
      data: session,
      message: 'Highlight added successfully',
    });
  } catch (error) {
    console.error('Error adding highlight:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/trends - Get reading trends over time
export const getReadingTrends = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get reading trends over time'
  // #swagger.description = 'Retrieve reading activity trends and patterns over a specified time period'
  // #swagger.parameters['userId'] = { description: 'User ID to filter trends (optional)', type: 'string', in: 'query' }
  // #swagger.parameters['months'] = { description: 'Number of months to analyze (default: 6)', type: 'integer', in: 'query' }
  // #swagger.parameters['startDate'] = { description: 'Start date for custom range (optional)', type: 'string', in: 'query' }
  // #swagger.parameters['endDate'] = { description: 'End date for custom range (optional)', type: 'string', in: 'query' }
  try {
    const userId = req.query.userId as string;
    const months = req.query.months ? parseInt(req.query.months as string) : 6;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    // Validate date parameters
    if (startDate && endDate) {
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
        });
      }
      if (startDate > endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date must be before end date',
        });
      }
    }

    const result = await readingSessionService.getReadingTrends(userId, months, startDate, endDate);

    res.json({
      success: true,
      data: result,
      message: 'Reading trends retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting reading trends:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/devices - Get device analytics
export const getDeviceAnalytics = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get device usage analytics'
  // #swagger.description = 'Retrieve analytics data about reading session distribution across different device types'
  try {
    const result = await readingSessionService.getDeviceAnalytics();

    res.json({
      success: true,
      data: result,
      message: 'Device analytics retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting device analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/most-highlighted-with-details - Get most highlighted books with complete book data
export const getMostHighlightedBooksWithDetails = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get most highlighted books with complete details'
  // #swagger.description = 'Retrieve books with the highest number of highlights including book titles, authors, and cover images'
  // #swagger.parameters['limit'] = { description: 'Number of books to return (default: 5)', type: 'integer', in: 'query' }
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const result = await readingSessionService.getMostHighlightedBooksWithDetails(limit);

    res.json({
      success: true,
      data: result,
      message: 'Most highlighted books with details retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting most highlighted books with details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/reading/top-books-time-with-details - Get top books by reading time with complete book data
export const getTopBooksByReadTimeWithDetails = async (req: Request, res: Response) => {
  // #swagger.tags = ['Reading Sessions']
  // #swagger.summary = 'Get top books by reading time with complete details'
  // #swagger.description = 'Retrieve books ranked by total reading time including book titles, authors, and cover images'
  // #swagger.parameters['limit'] = { description: 'Number of books to return (default: 10)', type: 'integer', in: 'query' }
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await readingSessionService.getTopBooksByReadTimeWithDetails(limit);

    res.json({
      success: true,
      data: result,
      message: 'Top books by reading time with details retrieved successfully',
    });
  } catch (error) {
    console.error('Error getting top books by reading time with details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
