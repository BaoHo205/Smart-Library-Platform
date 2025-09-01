import axiosInstance from '@/config/axiosConfig';
import { CheckoutApiResponse, CheckoutResponse } from '@/types/checkout.type';

const getAllCheckoutByUserId = async (
  // userId: string
): Promise<CheckoutResponse> => {
  const response = await axiosInstance.get(`/api/v1/checkouts/`);
  return response.data;
};

const borrowBook = async (bookId: string): Promise<CheckoutApiResponse> => {
  try {
    const response = await axiosInstance.post(`/api/v1/books/borrow/${bookId}`, {
      dueDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 2 weeks from now
    });
    return response.data as CheckoutApiResponse;
  } catch (error) {
    return Promise.reject(error);
  }

};

const returnBook = async (bookId: string): Promise<void> => {
  await axiosInstance.put(`/api/v1/books/return/${bookId}`);
};

export { getAllCheckoutByUserId, borrowBook, returnBook };
