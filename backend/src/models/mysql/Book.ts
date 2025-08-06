import { BookStatus } from "./enum/BookStatus";

export interface Book {
  id?: string;
  title: string;
  thumbnailUrl: string;
  isbn: string;
  quantity: number | 0;
  pageCount: number;
  publisherId: string;
  description: string;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}