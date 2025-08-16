import { Router } from 'express';
import { handleGetAllGenres } from '../controllers/GenreController';

const genreRouter = Router();

genreRouter.get('/', handleGetAllGenres);

export default genreRouter;