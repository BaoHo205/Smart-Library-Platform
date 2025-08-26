import { Router } from 'express';
import {
  startReadingSession,
  endReadingSession,
  addPagesRead,
  addHighlight,
  getAverageSessionTime,
  getMostHighlightedBooks,
  getTopBooksByReadTime,
  getReadingTrends,
  getDeviceAnalytics,
  getMostHighlightedBooksWithDetails,
  getTopBooksByReadTimeWithDetails,
} from '../controllers/ReadingSessionController';

const router = Router();

// management (route nhe )
router.post('/start', startReadingSession);
router.post('/end/:sessionId', endReadingSession);

// data
router.post('/:sessionId/pages', addPagesRead);
router.post('/:sessionId/highlights', addHighlight);

// reporting
router.get('/avg-time', getAverageSessionTime);
router.get('/most-highlighted', getMostHighlightedBooks);
router.get('/top-books-time', getTopBooksByReadTime);
router.get('/trends', getReadingTrends);
router.get('/devices', getDeviceAnalytics);

// enhanced reporting with complete book details
router.get(
  '/most-highlighted-with-details',
  getMostHighlightedBooksWithDetails
);
router.get('/top-books-time-with-details', getTopBooksByReadTimeWithDetails);

export default router;
