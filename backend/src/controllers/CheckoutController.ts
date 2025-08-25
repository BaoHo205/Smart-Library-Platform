import { Response, NextFunction } from 'express';
import { getAllCheckoutsByUserId } from '@/services/CheckoutService';
import { AuthRequest } from '@/middleware/authMiddleware';

async function handleGetAllCheckoutsByUserId(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // #swagger.tags = ['Checkouts']
  // #swagger.summary = 'Get all checkouts by user ID'
  // #swagger.description = 'Retrieve a list of all checkouts for a specific user.'
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const checkouts = await getAllCheckoutsByUserId(userId);
    res.status(200).json(checkouts);
  } catch (error) {
    next(error);
  }
}

export { handleGetAllCheckoutsByUserId };
