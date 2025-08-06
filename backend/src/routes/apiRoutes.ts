import { Router } from 'express';
import userRouter from './userRoutes';
import staffRouter from './staffRoutes';

const apiRouter = Router();


apiRouter.use('/usr', userRouter);
apiRouter.use('/admin', staffRouter);


export default apiRouter;