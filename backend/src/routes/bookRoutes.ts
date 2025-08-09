import { Router } from 'express';
import bookController from '@/controllers/BookController';

const bookRouter = Router();

// Search books by params
bookRouter.get('/', bookController.getBooks);

bookRouter.post('/:bookId/borrow', bookController.borrowBook);


export default bookRouter;