import axiosInstance from "@/config/axiosConfig";
import { CheckoutResponse } from "@/types/checkout.type";

const getAllCheckoutByUserId  = async (userId: string): Promise<CheckoutResponse>  => {
  const response = await axiosInstance.get(`/api/v1/checkouts/${userId}`);
  return response.data;
};

export { getAllCheckoutByUserId };