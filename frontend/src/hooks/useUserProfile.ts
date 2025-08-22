import axiosInstance from '@/config/axiosConfig';
import { useState, useEffect } from 'react';

interface CheckOut {
  bookId: string;
  bookName: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  isLate: boolean;
}

const useUserProfile = (userId: string) => {
  const [checkouts, setCheckouts] = useState<CheckOut[]>([]);
  const getAllCheckoutByUserId = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/checkouts/${userId}`);
      setCheckouts(response.data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
      throw error;
    }
  };

  useEffect(() => {
    getAllCheckoutByUserId(userId);
  }, [userId]);

  return { checkouts, setCheckouts };
};

export default useUserProfile;
