import GenreService from '@/services/GenreService';
import { Request, Response, NextFunction } from 'express';

const getGenres = async (req: Request, res: Response) => {
  try {
    const publishers = await GenreService.getGenres();
    res.status(200).json({
      success: true,
      message: 'Genres retrieved successfully',
      data: publishers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

export default { getGenres };
