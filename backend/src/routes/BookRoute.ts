import { Router, Request, Response } from "express";
import { addNewBook, getAllBooks, retireBook, updateBookInventory } from "../controllers/BookController";

const router = Router();

router.get('/', getAllBooks);
router.post('/add', addNewBook);
router.put('/:id/inventory', updateBookInventory);
router.put('/:id/status', retireBook);

export default router;