export interface Highlight {
    pageNumber: number;
    text: string;
    timestamp: string;
}

export enum DeviceType {
    MOBILE = 'mobile',
    TABLET = 'tablet',
    DESKTOP = 'desktop',
}

export interface ReadingSession {
    id?: string;
    userId: string;
    bookId: string;
    startTime: string;
    endTime?: string;
    device: DeviceType;
    pagesRead: number[];
    highlights: Highlight[];
    sessionDuration?: number;
    createdAt: string;
    updatedAt: string;
}

export interface MostHighlightedBook {
    bookId: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    totalHighlights: number;
    uniqueReadersCount: number;
    totalSessions: number;
    avgHighlightsPerSession: number;
    highlightDensity: number;
}

export interface TopBookByReadingTime {
    bookId: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    totalReadingTime: number;
    totalSessions: number;
    uniqueReadersCount: number;
    avgSessionDuration: number;
    totalPages: number;
    totalHighlights: number;
    engagementScore: number;
}

export interface MonthlySessionData {
    year: number;
    month: number;
    monthLabel: string;
    fullMonthLabel?: string;
    avgDuration: number;
    totalSessions: number;
    totalDuration: number;
}

export interface AverageSessionTimeData {
    dailyAverage: number;
    monthlyData: MonthlySessionData[];
    activeDaysCount: number;
    totalSessions: number;
}

export interface ReadingTrend {
    year: number;
    month: number;
    monthLabel: string;
    fullMonthLabel?: string;
    totalSessions: number;
    totalDuration: number;
    avgDuration: number;
    uniqueBooksCount: number;
    uniqueUsersCount: number;
}

export interface DeviceAnalytics {
    device: DeviceType;
    totalSessions: number;
    totalDuration: number;
    avgSessionDuration: number;
    uniqueUsersCount: number;
    percentage: number;
}

export interface AnalyticsFiltersState {
    months: number | 'all';
    dateRange?: {
        from: Date | undefined;
        to: Date | undefined;
    } | undefined;
    deviceType: 'all' | DeviceType;
    userId?: string;
    highlightedBooksLimit: number;
    topBooksLimit: number;
}

export interface ReadingSessionAnalyticsResponse {
    mostHighlightedBooks: MostHighlightedBook[];
    topBooksByReadingTime: TopBookByReadingTime[];
    averageSessionTime: AverageSessionTimeData;
    readingTrends: ReadingTrend[];
    deviceAnalytics: DeviceAnalytics[];
}


