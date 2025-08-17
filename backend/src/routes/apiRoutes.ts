import { Router } from 'express';
import userRouter from './userRoutes';
import staffRouter from './staffRoutes';
import bookRouter from './bookRoutes';
import authorRouter from './authorRoutes';
import publisherRouter from './publisherRoutes';
import genreRouter from './genreRoutes';

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/staff', staffRouter);
apiRouter.use('/books', bookRouter);
apiRouter.use('/authors', authorRouter);
apiRouter.use('/publishers', publisherRouter);
apiRouter.use('/genres', genreRouter);

export default apiRouter;
