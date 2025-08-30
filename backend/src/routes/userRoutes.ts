import { Router } from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.get('/profile', UserController.getProfile);

// User search endpoints (staff only)
userRouter.get('/all', authMiddleware.verifyStaff, UserController.getAllUsers);
userRouter.get(
  '/search',
  authMiddleware.verifyStaff,
  UserController.searchUsers
);

userRouter.post(
  '/reviewBook',
  authMiddleware.verifyStaffOrUser,
  UserController.reviewBook
);


export default userRouter;
