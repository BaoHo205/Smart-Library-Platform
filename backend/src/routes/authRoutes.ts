import { Router } from 'express';
import authController from '../controllers/AuthController';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/refresh', authController.generateNewAccessToken);
authRouter.get('/logout', authController.logout);
export default authRouter;
