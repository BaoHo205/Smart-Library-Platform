import { Request, Response, NextFunction } from 'express';
import { getAllGenres } from '../services/GenreService';

async function handleGetAllGenres(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // #swagger.tags = ['Genres']
  // #swagger.summary = 'Get all genres'
  // #swagger.description = 'Retrieve a list of all book genres.'
  try {
    const genres = await getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
}

export { handleGetAllGenres };
