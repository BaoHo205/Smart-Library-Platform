export interface Checkout {
  id?: string;
  userId: string;
  bookId: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate?: Date; // Optional, as the book may not have been returned yet
  isReturned: boolean | false;
  isLate: boolean | false;
  createdAt: Date;
  updatedAt: Date;
 }