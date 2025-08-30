import { Router } from 'express';
import bookController from '../controllers/BookController';

const bookRouter = Router();

// Search books by params
bookRouter.get('/', bookController.getBooks);
bookRouter.get('/:bookId', bookController.getBookInfoById);
bookRouter.get('/:bookId/reviews', bookController.getAllReviewsByBookId);
bookRouter.get('/:bookId/isBorrowed', bookController.isBookBorrowed);

bookRouter.post('/borrow/:bookId', bookController.borrowBook);
bookRouter.post('/add', bookController.addNewBook);

bookRouter.put('/return/:bookId', bookController.returnBook);
bookRouter.put('/update/:bookId', bookController.updateBook);
bookRouter.post('/add', bookController.addNewBook);
bookRouter.put('/inventory/:id', bookController.updateBookInventory);
bookRouter.put('/retired/:bookId', bookController.retireBook);
bookRouter.put('/copy/retired/:copyId', bookController.retireCopy);
bookRouter.post('/copy/create/:bookId', bookController.addCopy);
bookRouter.delete('/copy/delete/:copyId', bookController.deleteCopy);
bookRouter.get('/:bookId/isBorrowed', bookController.isBookBorrowed);
bookRouter.get('/:bookId/copies', bookController.getBookCopies)
export default bookRouter;
