import { Router } from 'express';
import userRouter from './userRoutes';
import staffRouter from './staffRoutes';
import bookRouter from './bookRoutes';
import genreRouter from './genreRoutes';
import checkoutRouter from './checkoutRoutes';

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/staff', staffRouter);
apiRouter.use('/books', bookRouter);
apiRouter.use('/genres', genreRouter);
apiRouter.use('/checkouts', checkoutRouter);

export default apiRouter;
