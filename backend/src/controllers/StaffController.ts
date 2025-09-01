import { Response } from 'express';
import StaffService from '../services/StaffService';
import { AuthRequest } from '@/middleware/authMiddleware';

const getMostBorrowedBooks = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Staff']
  // #swagger.summary = 'Get most borrowed books in a specific period'
  // #swagger.description = 'Retrieve statistics of the most frequently borrowed books. Staff access required.'
  try {
    const { startDate, endDate, limit, allTime } = req.query;

    // Check if this is an all-time request
    const isAllTime = allTime === 'true' || allTime === '1';

    if (!isAllTime) {
      // For time-based requests, validate dates
      const startDateStr = String(startDate || '').trim();
      const endDateStr = String(endDate || '').trim();

      if (!startDateStr || !endDateStr) {
        return res.status(400).json({
          success: false,
          message:
            'Start date and end date are required for time-based requests',
          data: {
            received: { startDate: startDateStr, endDate: endDateStr },
            format: 'Expected format: YYYY-MM-DD',
          },
        });
      }

      const startDateObj = new Date(startDateStr);
      const endDateObj = new Date(endDateStr);

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Please use YYYY-MM-DD format',
          data: {
            received: { startDate: startDateStr, endDate: endDateStr },
          },
        });
      }

      if (startDateObj > endDateObj) {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be later than end date',
        });
      }
    }

    const limitParam =
      typeof limit === 'string' && limit.trim().toLowerCase() === 'max'
        ? 'max'
        : limit
          ? Number(limit)
          : undefined;

    const result = await StaffService.getMostBorrowedBooks(
      isAllTime ? '' : String(startDate || '').trim(),
      isAllTime ? '' : String(endDate || '').trim(),
      limitParam,
      isAllTime
    );
    res.status(200).json({
      success: true,
      message: isAllTime
        ? 'All-time most borrowed books retrieved successfully'
        : 'Most borrowed books retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const getTopActiveReaders = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Staff']
  // #swagger.summary = 'Get top active readers by total checkouts'
  // #swagger.description = 'Retrieve statistics of the most active library users/readers. Staff access required.'
  try {
    const limit = req.query.limit || '10'; // Default to 10 if not provided
    const monthsBack = Number(req.query.monthsBack) || 6; // Default to 6
    const result = await StaffService.getTopActiveReaders(
      monthsBack,
      String(limit)
    );
    res.status(200).json({
      success: true,
      message: 'Top active readers retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const getBooksWithLowAvailability = async (req: AuthRequest, res: Response) => {
  // #swagger.tags = ['Staff']
  // #swagger.summary = 'Get books with low availability'
  // #swagger.description = 'Retrieve books that have low availability/stock levels. Staff access required.'
  try {
    const limitParam = req.query.lowAvailabilityLimit;
    let limit: number | 'max';

    if (limitParam === 'max') {
      limit = 'max';
    } else {
      limit = limitParam ? Number(limitParam) : 5;
    }

    const response = await StaffService.getBooksWithLowAvailability(limit);
    res.status(200).json({
      success: true,
      message: 'Books with low availability retrieved successfully',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

export default {
  getMostBorrowedBooks,
  getTopActiveReaders,
  getBooksWithLowAvailability,
};
