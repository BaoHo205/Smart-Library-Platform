export interface Review {
  id?: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}