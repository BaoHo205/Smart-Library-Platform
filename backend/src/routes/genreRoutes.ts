import { Router } from 'express';
import GenreController from '@/controllers/GenreController';

const genreRouter = Router();

genreRouter.get('/', GenreController.getGenres);

export default genreRouter;
