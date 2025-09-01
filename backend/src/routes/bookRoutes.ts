import { Router } from 'express';
import bookController from '../controllers/BookController';
import authMiddleware from '@/middleware/authMiddleware';

const bookRouter = Router();

// Search books by params
bookRouter.get('/', bookController.getBooks);
bookRouter.get('/:bookId', bookController.getBookInfoById);
bookRouter.get('/:bookId/reviews', bookController.getAllReviewsByBookId);
bookRouter.get('/:bookId/isBorrowed', bookController.isBookBorrowed);

bookRouter.post('/borrow/:bookId', bookController.borrowBook);
bookRouter.post('/add', bookController.addNewBook);

bookRouter.put('/return/:bookId', bookController.returnBook);
bookRouter.put('/update/:bookId', authMiddleware.verifyJWT, authMiddleware.verifyStaff, bookController.updateBook);
bookRouter.post('/add', authMiddleware.verifyJWT, authMiddleware.verifyStaff, bookController.addNewBook);
bookRouter.put('/inventory/:id', bookController.updateBookInventory);
bookRouter.put('/retired/:bookId', authMiddleware.verifyJWT, authMiddleware.verifyStaff, bookController.retireBook);
bookRouter.put('/copy/retired/:copyId', authMiddleware.verifyJWT, authMiddleware.verifyStaff, bookController.retireCopy);
bookRouter.post('/copy/create/:bookId', authMiddleware.verifyJWT, authMiddleware.verifyStaff, bookController.addCopy);
bookRouter.delete('/copy/delete/:copyId', authMiddleware.verifyJWT, authMiddleware.verifyStaff, bookController.deleteCopy);
bookRouter.get('/:bookId/isBorrowed', bookController.isBookBorrowed);
bookRouter.get('/:bookId/copies', bookController.getBookCopies)
export default bookRouter;
