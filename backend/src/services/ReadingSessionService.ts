import ReadingSessionModel, {
  ReadingSessionDocument,
} from '../models/mongodb/ReadingSessionSchema';
import { ReadingSession, Highlight } from '../models/mongodb/ReadingSession';
import { DeviceType } from '../models/mongodb/enum/DeviceType';
import BookService from './BookService';

// new reading session
export const startReadingSession = async (
  userId: string,
  bookId: string,
  device: DeviceType
): Promise<ReadingSessionDocument> => {
  const session = new ReadingSessionModel({
    userId,
    bookId,
    startTime: new Date(),
    device,
    pagesRead: [],
    highlights: [],
  });

  return await session.save();
};

// end a reading session
export const endReadingSession = async (
  sessionId: string
): Promise<ReadingSessionDocument | null> => {
  const session = await ReadingSessionModel.findById(sessionId);
  if (!session) return null;

  session.endTime = new Date();

  session.sessionDuration = Math.ceil(
    (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60) // minutes
  );

  return await session.save();
};

// add pages read
export const addPagesRead = async (
  sessionId: string,
  pages: number[]
): Promise<ReadingSessionDocument | null> => {
  return await ReadingSessionModel.findByIdAndUpdate(
    sessionId,
    { $addToSet: { pagesRead: { $each: pages } } },
    { new: true }
  );
};

// add highlight
export const addHighlight = async (
  sessionId: string,
  highlight: Highlight
): Promise<ReadingSessionDocument | null> => {
  return await ReadingSessionModel.findByIdAndUpdate(
    sessionId,
    { $push: { highlights: highlight } },
    { new: true }
  );
};

// aggregation pipeline
// 1. average session time per user with time-based analytics
// 2. most highlighted books with detailed analytics
// 3. top books by total reading time with engagement metrics
// 4. session by ID
// 5. all sessions for a user
// 6. all sessions for a book
// 7. get reading trends over time (for chart data)
// 8. get popular reading devices

// average session time per user with time-based analytics
export const getAverageSessionTime = async () => {
  return await ReadingSessionModel.aggregate([
    { $match: { sessionDuration: { $exists: true, $ne: null } } },
    {
      $addFields: {
        startTimeAsDate: {
          $cond: {
            if: { $type: '$startTime' },
            then: { $dateFromString: { dateString: '$startTime' } },
            else: '$startTime',
          },
        },
      },
    },
    {
      $addFields: {
        month: { $dateToString: { format: '%Y-%m', date: '$startTimeAsDate' } },
        fullMonthLabel: {
          $dateToString: { format: '%b %Y', date: '$startTimeAsDate' },
        },
        dayOfYear: { $dayOfYear: '$startTimeAsDate' },
      },
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          month: '$month',
        },
        totalSessions: { $sum: 1 },
        totalDuration: { $sum: '$sessionDuration' },
        averageDuration: { $avg: '$sessionDuration' },
        activeDays: { $addToSet: '$dayOfYear' },
      },
    },
    {
      $addFields: {
        activeDaysCount: { $size: '$activeDays' },
        dailyAverage: {
          $divide: ['$totalDuration', { $size: '$activeDays' }],
        },
      },
    },
    {
      $group: {
        _id: '$_id.userId',
        monthlyData: {
          $push: {
            month: '$_id.month',
            fullMonthLabel: '$fullMonthLabel',
            totalSessions: '$totalSessions',
            totalDuration: '$totalDuration',
            averageDuration: '$averageDuration',
            activeDaysCount: '$activeDaysCount',
            dailyAverage: '$dailyAverage',
          },
        },
        overallAverage: { $avg: '$averageDuration' },
        overallDailyAverage: { $avg: '$dailyAverage' },
      },
    },
    {
      $project: {
        userId: '$_id',
        monthlyData: 1,
        overallAverage: { $round: ['$overallAverage', 1] },
        overallDailyAverage: { $round: ['$overallDailyAverage', 1] },
      },
    },
    { $sort: { overallAverage: -1 } },
  ]);
};

// most highlighted books with detailed analytics
export const getMostHighlightedBooks = async (limit: number = 5) => {
  const pipeline: any[] = [
    { $match: { highlights: { $exists: true, $ne: [] } } },
    {
      $addFields: {
        startTimeAsDate: {
          $cond: {
            if: { $type: '$startTime' },
            then: { $dateFromString: { dateString: '$startTime' } },
            else: '$startTime',
          },
        },
      },
    },
    {
      $group: {
        _id: '$bookId',
        totalHighlights: { $sum: { $size: '$highlights' } },
        uniqueReaders: { $addToSet: '$userId' },
        totalSessions: { $sum: 1 },
      },
    },
    {
      $addFields: {
        uniqueReadersCount: { $size: '$uniqueReaders' },
        avgHighlightsPerSession: {
          $divide: ['$totalHighlights', '$totalSessions'],
        },
        highlightDensity: {
          $divide: ['$totalHighlights', '$totalSessions'],
        },
      },
    },
    {
      $project: {
        bookId: '$_id',
        totalHighlights: 1,
        uniqueReadersCount: 1,
        totalSessions: 1,
        avgHighlightsPerSession: { $round: ['$avgHighlightsPerSession', 1] },
        highlightDensity: { $round: ['$highlightDensity', 1] },
      },
    },
    { $sort: { totalHighlights: -1 } },
  ];

  if (limit !== 9999) {
    pipeline.push({ $limit: limit });
  }

  return await ReadingSessionModel.aggregate(pipeline);
};

// top books by total reading time with engagement metrics
export const getTopBooksByReadTime = async (limit: number = 10) => {
  const pipeline: any[] = [
    { $match: { sessionDuration: { $exists: true, $ne: null } } },
    {
      $addFields: {
        startTimeAsDate: {
          $cond: {
            if: { $type: '$startTime' },
            then: { $dateFromString: { dateString: '$startTime' } },
            else: '$startTime',
          },
        },
      },
    },
    {
      $group: {
        _id: '$bookId',
        totalReadingTime: { $sum: '$sessionDuration' },
        totalSessions: { $sum: 1 },
        uniqueReaders: { $addToSet: '$userId' },
        avgSessionDuration: { $avg: '$sessionDuration' },
        totalPages: { $sum: { $size: '$pagesRead' } },
        totalHighlights: { $sum: { $size: '$highlights' } },
      },
    },
    {
      $addFields: {
        uniqueReadersCount: { $size: '$uniqueReaders' },
        engagementScore: {
          $add: [
            { $multiply: ['$totalReadingTime', 0.4] },
            { $multiply: ['$uniqueReadersCount', 0.3] },
            { $multiply: ['$totalHighlights', 0.2] },
            { $multiply: ['$totalPages', 0.1] },
          ],
        },
      },
    },
    {
      $project: {
        bookId: '$_id',
        totalReadingTime: 1,
        totalSessions: 1,
        uniqueReadersCount: 1,
        avgSessionDuration: { $round: ['$avgSessionDuration', 1] },
        totalPages: 1,
        totalHighlights: 1,
        engagementScore: { $round: ['$engagementScore', 1] },
      },
    },
    { $sort: { totalReadingTime: -1 } },
  ];

  // Only add limit if it's not 9999 (which means "show all")
  if (limit !== 9999) {
    pipeline.push({ $limit: limit });
  }

  return await ReadingSessionModel.aggregate(pipeline);
};

// session by ID
export const getSessionById = async (
  sessionId: string
): Promise<ReadingSessionDocument | null> => {
  return await ReadingSessionModel.findById(sessionId);
};

// all sessions for a user
export const getSessionsByUser = async (
  userId: string
): Promise<ReadingSessionDocument[]> => {
  return await ReadingSessionModel.find({ userId }).sort({ startTime: -1 });
};

// all sessions for a book
export const getSessionsByBook = async (
  bookId: string
): Promise<ReadingSessionDocument[]> => {
  return await ReadingSessionModel.find({ bookId }).sort({ startTime: -1 });
};

// get reading trends over time (for chart data)
export const getReadingTrends = async (
  userId?: string,
  months: number | 'all' = 6,
  startDate?: Date,
  endDate?: Date
) => {
  const matchStage: any = {
    sessionDuration: { $exists: true, $ne: null },
  };

  if (startDate && endDate) {
    matchStage.$or = [
      { startTime: { $gte: startDate, $lte: endDate } },
      {
        startTime: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      },
    ];
  } else if (months !== 'all' && typeof months === 'number') {
    const dateThreshold = new Date(
      Date.now() - months * 30 * 24 * 60 * 60 * 1000
    );
    matchStage.$or = [
      { startTime: { $gte: dateThreshold } }, // Date objects
      { startTime: { $gte: dateThreshold.toISOString() } }, // String dates
    ];
  }
  // If months === 'all', don't add any date filter (get all data)

  if (userId) {
    matchStage.userId = userId;
  }

  return await ReadingSessionModel.aggregate([
    { $match: matchStage },
    {
      $addFields: {
        startTimeAsDate: {
          $cond: {
            if: { $type: '$startTime' },
            then: { $dateFromString: { dateString: '$startTime' } },
            else: '$startTime',
          },
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$startTimeAsDate' },
          month: { $month: '$startTimeAsDate' },
        },
        totalSessions: { $sum: 1 },
        totalDuration: { $sum: '$sessionDuration' },
        avgDuration: { $avg: '$sessionDuration' },
        uniqueBooks: { $addToSet: '$bookId' },
        uniqueUsers: { $addToSet: '$userId' },
      },
    },
    {
      $addFields: {
        monthLabel: {
          $dateToString: {
            format: '%b',
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
              },
            },
          },
        },
        fullMonthLabel: {
          $dateToString: {
            format: '%b %Y',
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
              },
            },
          },
        },
        uniqueBooksCount: { $size: '$uniqueBooks' },
        uniqueUsersCount: { $size: '$uniqueUsers' },
      },
    },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        monthLabel: 1,
        fullMonthLabel: 1,
        totalSessions: 1,
        totalDuration: 1,
        avgDuration: { $round: ['$avgDuration', 1] },
        uniqueBooksCount: 1,
        uniqueUsersCount: 1,
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
};

// get popular reading devices
export const getDeviceAnalytics = async () => {
  return await ReadingSessionModel.aggregate([
    {
      $group: {
        _id: '$device',
        totalSessions: { $sum: 1 },
        totalDuration: { $sum: '$sessionDuration' },
        avgDuration: { $avg: '$sessionDuration' },
        uniqueUsers: { $addToSet: '$userId' },
      },
    },
    {
      $addFields: {
        uniqueUsersCount: { $size: '$uniqueUsers' },
      },
    },
    {
      $project: {
        device: '$_id',
        totalSessions: 1,
        totalDuration: 1,
        avgDuration: { $round: ['$avgDuration', 1] },
        uniqueUsersCount: 1,
        percentage: {
          $multiply: [
            { $divide: ['$totalSessions', { $sum: '$totalSessions' }] },
            100,
          ],
        },
      },
    },
    { $sort: { totalSessions: -1 } },
  ]);
};

export const getMostHighlightedBooksWithDetails = async (limit: number = 5) => {
  // Get reading session analytics
  const sessionData = await getMostHighlightedBooks(limit);

  // Fetch book details for each bookId
  const booksWithDetails = await Promise.all(
    sessionData.map(async (item: any) => {
      const bookDetails = await BookService.getBookInfoById(item.bookId);
      return {
        bookId: item.bookId,
        title: bookDetails?.title || 'Unknown Title',
        author: bookDetails?.authors || 'Unknown Author',
        coverUrl: bookDetails?.thumbnailUrl || null,
        totalHighlights: item.totalHighlights,
        uniqueReadersCount: item.uniqueReadersCount,
        totalSessions: item.totalSessions,
        avgHighlightsPerSession: item.avgHighlightsPerSession,
        highlightDensity: item.highlightDensity,
      };
    })
  );

  return booksWithDetails;
};

export const getTopBooksByReadTimeWithDetails = async (limit: number = 10) => {
  const sessionData = await getTopBooksByReadTime(limit);
  const booksWithDetails = await Promise.all(
    sessionData.map(async (item: any) => {
      const bookDetails = await BookService.getBookInfoById(item.bookId);
      return {
        bookId: item.bookId,
        title: bookDetails?.title || 'Unknown Title',
        author: bookDetails?.authors || 'Unknown Author',
        coverUrl: bookDetails?.thumbnailUrl || null,
        totalReadingTime: item.totalReadingTime,
        totalSessions: item.totalSessions,
        uniqueReadersCount: item.uniqueReadersCount,
        avgSessionDuration: item.avgSessionDuration,
        totalPages: item.totalPages,
        totalHighlights: item.totalHighlights,
        engagementScore: item.engagementScore,
      };
    })
  );

  return booksWithDetails;
};
