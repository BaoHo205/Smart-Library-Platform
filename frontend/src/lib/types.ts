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

export interface UserProfile {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'staff';
    createdAt: string; 
    updatedAt: string; 
    displayName?: string; 
    avatarUrl?: string | null;
}

export interface Book {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    isbn: string;
    quantity: number;
    pageCount: number;
    publisherId: string;
    description: string;
    status: 'available' | 'unavailable';
    createdAt: string; 
    updatedAt: string; 
    authors?: string[]; 
    genres?: string[]; 
    publisherName?: string; 
}

export interface BookAnalytics {
    bookId: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    totalHighlights: number;
    totalReadingTime: number; 
}

// ===== ANALYTICS TYPES =====
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

export interface BookAvailability {
    bookId: string;
    title: string;
    author: string;
    availableCopies: number;
    totalCopies: number;
    availabilityPercentage: number;
}

export interface AverageSessionTimeData {
    dailyAverage: number; 
    monthlyData: MonthlySessionData[];
    activeDaysCount: number;
    totalSessions: number;
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

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface ApiError {
    success: false;
    message: string;
    error?: any;
}

// ===== COMPONENT STATE TYPES =====

export interface LoadingState {
    highlightedBooks: boolean;
    lowAvailabilityBooks: boolean;
    topBooks: boolean;
    readingTrends: boolean;
    deviceAnalytics: boolean;
    userProfile: boolean;
}

export interface ComponentState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// ===== ANALYTICS FILTERS =====

export interface AnalyticsFiltersState {
    months: number; 
    dateRange?: {
        from: Date | undefined;
        to: Date | undefined;
    } | undefined;
    deviceType: 'all' | DeviceType;
    userId?: string; 
    highlightedBooksLimit: number; 
    topBooksLimit: number; 
}

export interface AuthUser {
    id: string;
    name: string;
    displayName: string;
    role: 'user' | 'staff';
    avatarUrl?: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        role: string;
        accessToken: string;
    };
}

// ===== READING SESSION API RESPONSE TYPES =====

export interface ReadingSessionAnalyticsResponse {
    mostHighlightedBooks: MostHighlightedBook[];
    topBooksByReadingTime: TopBookByReadingTime[];
    averageSessionTime: AverageSessionTimeData;
    readingTrends: ReadingTrend[];
    deviceAnalytics: DeviceAnalytics[];
}

// ===== UTILITY TYPES =====

export type ViewMode = 'personal' | 'platform';

export type BookClickHandler = (bookId: string) => void;

export type FilterChangeHandler = (filters: Partial<AnalyticsFiltersState>) => void;
