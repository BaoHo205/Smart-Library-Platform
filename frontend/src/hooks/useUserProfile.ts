import axiosInstance from '@/config/axiosConfig';
import { useEffect, useState } from 'react';

interface CheckOut {
  bookId: string;
  bookName: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  isLate: boolean;
}

const useUserProfile = () => {
  const [checkouts, setCheckouts] = useState<CheckOut[]>([]);
  const getAllCheckoutByUserId = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/checkouts/`);
      setCheckouts(response.data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
      throw error;
    }
  };

  useEffect(() => {
    getAllCheckoutByUserId();
  }, []);

  return { checkouts, setCheckouts };
};

export default useUserProfile;
