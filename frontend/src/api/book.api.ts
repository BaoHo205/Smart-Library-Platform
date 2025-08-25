import { GetAllBooksResponse } from "@/types/book.type";
// import { AxiosResponse } from 'axios';
import axiosInstance from "@/config/axiosConfig";

const getAllBooks = async (currentGenre: string, currentPage: number, searchParam: string, searchInput: string): Promise<GetAllBooksResponse> => {
  const response = await axiosInstance.get(
    `api/v1/books?pageSize=12&page=${currentPage}&genre=${currentGenre}&${searchParam}=${searchInput}`
  );
  return response.data.data || [];
};

export { getAllBooks }