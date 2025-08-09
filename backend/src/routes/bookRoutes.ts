import { Router } from 'express';
import bookController from '@/controllers/BookController';

const bookRouter = Router();

// Search books by params
bookRouter.get('/', bookController.getBooks);
bookRouter.post('/borrow/:bookId', bookController.borrowBook);
bookRouter.put('/return/:bookId', bookController.returnBook);

export default bookRouter;