import ReadingSessionModel, { ReadingSessionDocument } from '../models/mongodb/ReadingSessionSchema';
import { ReadingSession, Highlight } from '../models/mongodb/ReadingSession';
import { DeviceType } from '../models/mongodb/enum/DeviceType';

export class ReadingSessionService {

    // new reading session
    async startReadingSession(userId: string, bookId: string, device: DeviceType): Promise<ReadingSessionDocument> {
        const session = new ReadingSessionModel({
            userId,
            bookId,
            startTime: new Date(),
            device,
            pagesRead: [],
            highlights: []
        });

        return await session.save();
    }

    // end a reading session 
    async endReadingSession(sessionId: string): Promise<ReadingSessionDocument | null> {
        const session = await ReadingSessionModel.findById(sessionId);
        if (!session) return null;

        session.endTime = new Date();
        session.sessionDuration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);

        return await session.save();
    }

    // add pages read 
    async addPagesRead(sessionId: string, pages: number[]): Promise<ReadingSessionDocument | null> {
        return await ReadingSessionModel.findByIdAndUpdate(
            sessionId,
            { $addToSet: { pagesRead: { $each: pages } } },
            { new: true }
        );
    }

    // add highlight
    async addHighlight(sessionId: string, highlight: Highlight): Promise<ReadingSessionDocument | null> {
        return await ReadingSessionModel.findByIdAndUpdate(
            sessionId,
            { $push: { highlights: highlight } },
            { new: true }
        );
    }

    // average session time per user
    async getAverageSessionTime() {
        return await ReadingSessionModel.aggregate([
            { $match: { sessionDuration: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$userId',
                    totalSessions: { $sum: 1 },
                    totalDuration: { $sum: '$sessionDuration' },
                    averageDuration: { $avg: '$sessionDuration' }
                }
            },
            {
                $project: {
                    userId: '$_id',
                    totalSessions: 1,
                    totalDuration: 1,
                    averageDuration: { $round: ['$averageDuration', 2] }
                }
            },
            { $sort: { averageDuration: -1 } }
        ]);
    }

    // most highlighted
    async getMostHighlightedBooks() {
        return await ReadingSessionModel.aggregate([
            {
                $group: {
                    _id: '$bookId',
                    totalHighlights: { $sum: { $size: '$highlights' } }
                }
            },
            {
                $project: {
                    bookId: '$_id',
                    totalHighlights: 1
                }
            },
            { $sort: { totalHighlights: -1 } }
        ]);
    }

    // top 10 books by total reading time
    async getTopBooksByReadTime() {
        return await ReadingSessionModel.aggregate([
            { $match: { sessionDuration: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$bookId',
                    totalReadingTime: { $sum: '$sessionDuration' }
                }
            },
            {
                $project: {
                    bookId: '$_id',
                    totalReadingTime: 1
                }
            },
            { $sort: { totalReadingTime: -1 } },
            { $limit: 10 }
        ]);
    }

    // session by ID
    async getSessionById(sessionId: string): Promise<ReadingSessionDocument | null> {
        return await ReadingSessionModel.findById(sessionId);
    }

    // all sessions for a user
    async getSessionsByUser(userId: string): Promise<ReadingSessionDocument[]> {
        return await ReadingSessionModel.find({ userId }).sort({ startTime: -1 });
    }

    // all sessions for a book
    async getSessionsByBook(bookId: string): Promise<ReadingSessionDocument[]> {
        return await ReadingSessionModel.find({ bookId }).sort({ startTime: -1 });
    }
} 