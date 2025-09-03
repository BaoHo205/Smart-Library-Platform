import { DeviceType } from './enum/DeviceType';

export interface ReadingSession {
  id?: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime?: Date; 
  device: DeviceType;
  pagesRead: number[];
  highlights: Highlight[];
  sessionDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Highlight {
  pageNumber: number;
  text: string;
  timestamp: Date;
}
