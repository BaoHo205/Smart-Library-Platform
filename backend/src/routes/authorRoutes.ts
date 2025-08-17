import { Router } from 'express';
import AuthorController from '@/controllers/AuthorController';

const authorRouter = Router();

authorRouter.get('/', AuthorController.getAuthors);
authorRouter.post('/create', AuthorController.createNewAuthor);

export default authorRouter;