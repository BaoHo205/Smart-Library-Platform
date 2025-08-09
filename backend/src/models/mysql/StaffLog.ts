import { ActionType } from './enum/ActionType';

export interface StaffLog {
  id?: string;
  userId: string;
  bookId: string;
  actionType: ActionType;
  actionDetails: string;
  createdAt: Date;
  updatedAt: Date;
}
