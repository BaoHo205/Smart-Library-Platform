import { Router } from 'express';
import { ReadingSessionController } from '../controllers/ReadingSessionController';

const router = Router();
const readingSessionController = new ReadingSessionController();

// management (route nhe )
router.post('/start', readingSessionController.startReadingSession);
router.post('/end/:sessionId', readingSessionController.endReadingSession);

// data 
router.post('/:sessionId/pages', readingSessionController.addPagesRead);
router.post('/:sessionId/highlights', readingSessionController.addHighlight);

// reporting 
router.get('/avg-time', readingSessionController.getAverageSessionTime);
router.get('/most-highlighted', readingSessionController.getMostHighlightedBooks);
router.get('/top-books-time', readingSessionController.getTopBooksByReadTime);

export default router; 