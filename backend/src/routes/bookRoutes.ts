import { Router } from 'express';
import { getBooks } from '@/controllers/BookController';

const bookRouter = Router();

// Search books by params
bookRouter.get('/', getBooks);

export default bookRouter;