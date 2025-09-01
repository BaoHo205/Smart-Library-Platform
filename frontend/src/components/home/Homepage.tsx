'use client';
import { Book } from '@/types/book.type';
import BookCardList from '@/components/home/BookCardList';
import Header from '@/components/home/Header';
import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const HomePage = ({
  initialData,
}: {
  initialData?: { result?: { data: Book[]; total?: number } };
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentGenre = searchParams.get('genre') ?? '';
  const searchParam = searchParams.get('searchBy') ?? 'title';
  const searchInput = searchParams.get('q') ?? '';
  const [currentPageState, setCurrentPageState] = useState<number>(1);

  const currentPage = Number(searchParams.get('page') ?? currentPageState ?? 1);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k);
      else params.set(k, String(v));
    });
    const q = params.toString();
    const url = q ? `?${q}` : '/';
    router.push(url);
    router.refresh();
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

  const books: Book[] = initialData?.result?.data || [];
  const pages: number = Math.floor((initialData?.result?.total || 0) / 9) || 0;

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
