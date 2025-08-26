import axiosInstance from '@/config/axiosConfig';
import { CheckoutResponse } from '@/types/checkout.type';

const getAllCheckoutByUserId = async (
  userId: string
): Promise<CheckoutResponse> => {
  const response = await axiosInstance.get(`/api/v1/checkouts/${userId}`);
  return response.data;
};

const borrowBook = async (bookId: string): Promise<void> => {
  await axiosInstance.post(`/api/v1/books/borrow/${bookId}`, {
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  });
};

const returnBook = async (bookId: string): Promise<void> => {
  await axiosInstance.put(`/api/v1/books/return/${bookId}`);
};

export { getAllCheckoutByUserId, borrowBook, returnBook };
