import { Router } from 'express';
import userRouter from './userRoutes';
import staffRouter from './staffRoutes';
import bookRouter from './bookRoutes';
import readingSessionRouter from './readingSessionRoutes';

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/staff', staffRouter);
apiRouter.use('/books', bookRouter);
apiRouter.use('/reading-sessions', readingSessionRouter);

export default apiRouter;
