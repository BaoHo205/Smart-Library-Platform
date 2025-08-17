import { Router } from 'express';
import PublisherController from '@/controllers/PublisherController';

const publisherRouter = Router();

publisherRouter.get('/', PublisherController.getPublishers);
publisherRouter.post('/create', PublisherController.createNewPublisher);

export default publisherRouter;