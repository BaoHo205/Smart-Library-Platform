import axiosInstance from '@/config/axiosConfig';
import type { MostHighlightedBook, TopBookByReadingTime, ReadingTrend } from '@/types/reading-session.type';

export const getMostHighlightedBooksWithDetails = async (limit: number = 5): Promise<MostHighlightedBook[]> => {
    const response = await axiosInstance.get(`/api/v1/reading-sessions/most-highlighted-with-details?limit=${limit}`);
    return response.data.data;
};

export const getTopBooksByReadTimeWithDetails = async (limit: number = 10): Promise<TopBookByReadingTime[]> => {
    const response = await axiosInstance.get(`/api/v1/reading-sessions/top-books-time-with-details?limit=${limit}`);
    return response.data.data;
};

export const getAverageSessionTime = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/api/v1/reading-sessions/avg-time');
    return response.data.data;
};

export const getReadingTrends = async (
    userId?: string,
    months: number | 'all' = 6,
    dateRange?: { from: Date | undefined; to: Date | undefined }
): Promise<ReadingTrend[]> => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (dateRange?.from && dateRange?.to) {
        params.append('startDate', dateRange.from.toISOString().split('T')[0]);
        params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    } else {
        params.append('months', months.toString());
    }
    const response = await axiosInstance.get(`/api/v1/reading-sessions/trends?${params.toString()}`);
    return response.data.data;
};


