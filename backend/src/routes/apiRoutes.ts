import { Router } from 'express';
import userRouter from './userRoutes';
import staffRouter from './staffRoutes';
import bookRouter from './bookRoutes';

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/staff', staffRouter);
apiRouter.use('/books', bookRouter);

export default apiRouter;
