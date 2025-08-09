import { Router } from 'express';
import StaffController from '../controllers/StaffController';
import authMiddleware from '../middleware/authMiddleware';

const staffRouter = Router();

staffRouter.get(
  '/most-borrowed-books',
  authMiddleware.verifyStaff,
  StaffController.getMostBorrowedBooks
);
staffRouter.get(
  '/top-active-readers',
  authMiddleware.verifyStaff,
  StaffController.getTopActiveReaders
);
staffRouter.get(
  '/low-availability',
  authMiddleware.verifyStaff,
  StaffController.getBooksWithLowAvailability
);

export default staffRouter;
