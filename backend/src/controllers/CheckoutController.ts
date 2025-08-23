import { Request, Response, NextFunction } from 'express';
import { getAllCheckoutsByUserId } from '@/services/CheckoutService';

async function handleGetAllCheckoutsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // #swagger.tags = ['Checkouts']
  // #swagger.summary = 'Get all checkouts by user ID'
  // #swagger.description = 'Retrieve a list of all checkouts for a specific user.'
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const checkouts = await getAllCheckoutsByUserId(req.params.userId);
    res.status(200).json(checkouts);
  } catch (error) {
    next(error);
  }
}

export { handleGetAllCheckoutsByUserId };
