import { Router } from 'express';
import { getBooks, addNewBook, retireBook, updateBookInventory } from '@/controllers/BookController';
// import { addNewBook, retireBook, updateBookInventory } from "../controllers/book.controller";

const bookRouter = Router();

// Search books by params
bookRouter.get('/', getBooks);
bookRouter.post('/add', addNewBook);
bookRouter.put('/:id/inventory', updateBookInventory);
bookRouter.put('/:id/retired', retireBook);

export default bookRouter;