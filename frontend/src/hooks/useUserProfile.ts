import axiosInstance from '@/config/axiosConfig';
import { useEffect, useState } from 'react';
import { CheckoutItem } from '@/types/checkout.type';

const useUserProfile = () => {
  const [checkouts, setCheckouts] = useState<CheckoutItem[]>([]);
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
