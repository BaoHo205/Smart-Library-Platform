import { Request, Response, NextFunction } from 'express';
import { searchBooks } from '@/services/BookService';

export async function getBooks(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await searchBooks({
      q: req.query.q as string,
      title: req.query.title as string,
      author: req.query.author as string,
      genre: req.query.genre as string,
      publisher: req.query.publisher as string,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      sort: (req.query.sort as 'title' | 'publisher' | 'available'),
      order: (req.query.order as 'asc' | 'desc')
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}