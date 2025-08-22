'use client'
import { useState, useEffect } from "react";
import { CheckoutItem } from "@/types/checkout.type";
import { getAllCheckoutByUserId } from "@/api/checkout.api";

const useUserProfile = (userId: string) => {
  const [checkouts, setCheckouts] = useState<CheckoutItem[]>([]);
  const fetchAllCheckouts = async (userId: string) => {
    try {
      const response = await getAllCheckoutByUserId(userId);
      setCheckouts(response);
      console.log('Checkouts fetched:', response);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllCheckouts(userId);
  }, [userId]);

  return { checkouts, setCheckouts };
};

export default useUserProfile;
