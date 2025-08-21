import { Router } from 'express';
import bookController from '../controllers/BookController';

const bookRouter = Router();

// Search books by params
bookRouter.get('/', bookController.getBooks);
bookRouter.get('/:bookId', bookController.getBookInfoById);
bookRouter.get('/:bookId/reviews', bookController.getAllReviewsByBookId);
bookRouter.post('/borrow/:bookId', bookController.borrowBook);
bookRouter.put('/return/:bookId', bookController.returnBook);
bookRouter.get('/:bookId/isBorrowed', bookController.isBookBorrowed);
export default bookRouter;
