export interface BookAuthor {
  id?: string;
  bookId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}