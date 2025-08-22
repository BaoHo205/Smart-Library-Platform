import { Router } from 'express';
import authController from '../controllers/AuthController';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.generateNewAccessToken);
authRouter.post('/logout', authController.logout);
export default authRouter;
