import { Book } from '@/types/book.type';
import BookCardList from '@/components/home/BookCardList';
import Header from '@/components/home/Header';
import Image from 'next/image';
import { headers } from 'next/headers';

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const genre = searchParams?.genre ?? '';
  const page = Number(searchParams?.page ?? 1);
  const searchBy = searchParams?.searchBy ?? 'title';
  const q = searchParams?.q ?? '';

  const params = new URLSearchParams();
  if (genre) params.set('genre', genre);
  if (page) params.set('page', String(page));
  if (searchBy) params.set('searchBy', searchBy);
  if (q) params.set('q', q);

  const paramsString = params.toString();

  const headersList = await headers();
  const cookie = headersList.get('cookie') ?? '';

  const pageSize = 12;
  const bookResponse = await fetch(
    `${DEFAULT_BASE}/api/v1/books?pageSize=${pageSize}&page=${page}&genre=${encodeURIComponent(genre)}&${encodeURIComponent(
      searchBy
    )}=${encodeURIComponent(q)}`,
    {
      headers: { cookie },
      next: { tags: [`books:${paramsString}`] },
    }
  );

  let bookData = null;
  if (bookResponse.ok) {
    try {
      bookData = await bookResponse.json();
    } catch {
      bookData = null;
    }
  } else {
    bookData = null;
  }

  const books: Book[] = bookData?.result?.data || [];
  const total = bookData?.result?.total || 0;
  const pages: number = Math.max(1, Math.ceil(total / pageSize));

  const genreResponse = await fetch(`${DEFAULT_BASE}/api/v1/genres`, {
    headers: { cookie },
    next: { tags: [`books:${paramsString}`] },
  });

  let genreData = null;
  if (genreResponse.ok) {
    try {
      genreData = await genreResponse.json();
    } catch {
      genreData = null;
    }
  } else {
    genreData = null;
  }

  return (
    <div className="flex">
      <div className="flex w-full flex-col justify-center gap-6 p-6">
        <Header genres={genreData?.data || []} />
        <Image
          src="/default-image.png"
          alt="Banner Image"
          width={100}
          height={100}
          className="h-full w-full"
        />
        <BookCardList books={books} pages={pages} />
      </div>
    </div>
  );
}
