import { DeviceType } from './enum/DeviceType';

export interface ReadingSession {
  id?: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime: Date;
  device: DeviceType;
  pagesRead: number[];
  highlights: number[];
  sessionDuration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}
