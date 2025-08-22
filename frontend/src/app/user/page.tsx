'use client';

import { BookCardProps } from '@/components/home/BookCard';
import BookCardList from '@/components/home/BookCardList';
import Header from '@/components/home/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';

export default function Home() {
  const [currentGenre, setCurrentGenre] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('title');
  const [searchInput, setSearchInput] = useState<string>('');
  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleCurrentGenreChange = (genre: string): void => {
    setCurrentGenre(genre);
  };

  const handleSearchParamChange = (param: string): void => {
    setSearchParam(param);
  };

  const handleSearchInputChange = (input: string): void => {
    setSearchInput(input);
  };

  const handleNextPage = (): void => {
    if (currentPage < pages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const fetchBooks = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get(
        `api/v1/books?pageSize=9&page=${currentPage}&genre=${currentGenre}&${searchParam}=${searchInput}`
      );
      setBooks(response.data.data.data || []);
      setPages(Math.ceil(response.data.data.total / 9));
      console.log('Books fetched:', response.data.data.data);
      console.log('Current genre:', currentGenre);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
      setPages(0);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentGenre, searchParam, searchInput, currentPage]);

  return (
    <div className="flex">
      <div className="flex w-full flex-col justify-center gap-6 p-6">
        <Header
          onCurrentGenreChange={handleCurrentGenreChange}
          onSearchParamChange={handleSearchParamChange}
          onSearchInputChange={handleSearchInputChange}
          searchParam={searchParam}
          searchInput={searchInput}
          currentGenre={currentGenre}
        />
        <Image
          src="/default-image.png"
          alt="Banner Image"
          width={100}
          height={100}
          className="h-full w-full"
        />
        <BookCardList
          books={books}
          pages={pages}
          currentPage={currentPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
