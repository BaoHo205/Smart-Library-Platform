import { Router } from 'express';
import {
    startReadingSession,
    endReadingSession,
    addPagesRead,
    addHighlight,
    getAverageSessionTime,
    getMostHighlightedBooks,
    getTopBooksByReadTime
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

export default router; 
