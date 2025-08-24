export interface CheckoutItem {
  bookId: string;
  bookName: string;
  bookAuthors: string;
  bookGenres: string;
  checkoutDate: string; // ISO date string
  dueDate: string; // ISO date string
  returnDate: string | null; // ISO date string or null if not returned
  isReturned: 0 | 1; // 0 for false, 1 for true (boolean as number)
  isLate: 0 | 1; // 0 for false, 1 for true (boolean as number)
}

export type CheckoutResponse = CheckoutItem[];

// Alternative with boolean conversion helpers
export interface CheckoutItemWithBooleans extends Omit<CheckoutItem, 'isReturned' | 'isLate'> {
  isReturned: boolean;
  isLate: boolean;
}

// Utility function to convert number booleans to actual booleans
export const convertCheckoutItem = (item: CheckoutItem): CheckoutItemWithBooleans => ({
  ...item,
  isReturned: Boolean(item.isReturned),
  isLate: Boolean(item.isLate),
});

// Checkout status enum for better type safety
export enum CheckoutStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
  OVERDUE = 'overdue'
}

// Helper type for filtering checkouts
export interface CheckoutFilters {
  status?: CheckoutStatus;
  bookId?: string;
  dateFrom?: string;
  dateTo?: string;
}