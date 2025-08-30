'use client';
import { Book } from '@/types/book.type';
import BookCardList from '@/components/home/BookCardList';
import Header from '@/components/home/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllBooks } from '@/api/books.api';

const HomePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentGenre = searchParams.get('genre') ?? '';
  const searchParam = searchParams.get('searchBy') ?? 'title';
  const searchInput = searchParams.get('q') ?? '';
  const [books, setBooks] = useState<Book[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPageState, setCurrentPageState] = useState<number>(1);

  const currentPage = Number(searchParams.get('page') ?? currentPageState ?? 1);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k);
      else params.set(k, String(v));
    });
    // push new params (relative URL)
    const q = params.toString();
    router.push(q ? `?${q}` : '/');
  };

  const handleCurrentGenreChange = (genre: string): void => {
    updateParams({ genre, page: 1 });
  };

  const handleSearchParamChange = (param: string): void => {
    updateParams({ searchBy: param, page: 1 });
  };

  const handleSearchInputChange = (input: string): void => {
    updateParams({ q: input, page: 1 });
  };

  const handleNextPage = (): void => {
    if (currentPage < pages) {
      updateParams({ page: currentPage + 1 });
      setCurrentPageState(currentPage + 1);
    }
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      updateParams({ page: currentPage - 1 });
      setCurrentPageState(currentPage - 1);
    }
  };

  const handlePageChange = (page: number): void => {
    updateParams({ page });
    setCurrentPageState(page);
  };

  const fetchBooks = async (): Promise<void> => {
    try {
      const bookResponse = await getAllBooks(
        currentGenre,
        currentPage,
        searchParam,
        searchInput
      );
      setBooks(bookResponse.data);
      setPages(Math.ceil(bookResponse.total / 9));
      console.log('Books fetched:', bookResponse);
      console.log('Current genre:', currentGenre);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
      setPages(0);
    }
  };

  // Re-fetch when URL search params change
  useEffect(() => {
    fetchBooks();
  }, [searchParams?.toString()]);

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
};

export default HomePage;
