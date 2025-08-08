import { Request, Response } from 'express';
import { ReadingSessionService } from '../services/ReadingSessionService';
import { DeviceType } from '../models/mongodb/enum/DeviceType';
import { Highlight } from '../models/mongodb/ReadingSession';

export class ReadingSessionController {
    private readingSessionService: ReadingSessionService;

    constructor() {
        this.readingSessionService = new ReadingSessionService();
    }

    // POST /api/reading/start - Start a new reading session
    startReadingSession = async (req: Request, res: Response) => {
        try {
            const { userId, bookId, device } = req.body;

            if (!userId || !bookId || !device) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, bookId, and device are required'
                });
            }

            if (!Object.values(DeviceType).includes(device)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid device type. Must be mobile, tablet, or desktop nhe ban :>'
                });
            }

            const session = await this.readingSessionService.startReadingSession(
                userId,
                bookId,
                device as DeviceType
            );

            res.status(201).json({
                success: true,
                data: session,
                message: 'Reading session started successfully'
            });
        } catch (error) {
            console.error('Error starting reading session:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // POST /api/reading/end/:sessionId - End a reading session
    endReadingSession = async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID is required'
                });
            }

            const session = await this.readingSessionService.endReadingSession(sessionId);

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Reading session not found'
                });
            }

            res.json({
                success: true,
                data: session,
                message: 'Reading session ended successfully'
            });
        } catch (error) {
            console.error('Error ending reading session:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // GET /api/reading/avg-time: Get average session time per user
    getAverageSessionTime = async (req: Request, res: Response) => {
        try {
            const result = await this.readingSessionService.getAverageSessionTime();

            res.json({
                success: true,
                data: result,
                message: 'Average session time retrieved successfully'
            });
        } catch (error) {
            console.error('Error getting average session time:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // GET /api/reading/most-highlighted - Get most highlighted books
    getMostHighlightedBooks = async (req: Request, res: Response) => {
        try {
            const result = await this.readingSessionService.getMostHighlightedBooks();

            res.json({
                success: true,
                data: result,
                message: 'Most highlighted books retrieved successfully'
            });
        } catch (error) {
            console.error('Error getting most highlighted books:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // GET /api/reading/top-books-time - Get top 10 books by reading time
    getTopBooksByReadTime = async (req: Request, res: Response) => {
        try {
            const result = await this.readingSessionService.getTopBooksByReadTime();

            res.json({
                success: true,
                data: result,
                message: 'Top books by reading time retrieved successfully'
            });
        } catch (error) {
            console.error('Error getting top books by reading time:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // POST /api/reading/:sessionId/pages - Add pages read to session
    addPagesRead = async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const { pages } = req.body;

            if (!sessionId || !pages || !Array.isArray(pages)) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID and pages array are required'
                });
            }

            const session = await this.readingSessionService.addPagesRead(sessionId, pages);

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Reading session not found'
                });
            }

            res.json({
                success: true,
                data: session,
                message: 'Pages read added successfully'
            });
        } catch (error) {
            console.error('Error adding pages read:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // POST /api/reading/:sessionId/highlights - Add highlight to session
    addHighlight = async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const { pageNumber, text } = req.body;

            if (!sessionId || !pageNumber || !text) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID, page number, and text are required'
                });
            }

            const highlight: Highlight = {
                pageNumber,
                text,
                timestamp: new Date()
            };

            const session = await this.readingSessionService.addHighlight(sessionId, highlight);

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Reading session not found'
                });
            }

            res.json({
                success: true,
                data: session,
                message: 'Highlight added successfully'
            });
        } catch (error) {
            console.error('Error adding highlight:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
} 