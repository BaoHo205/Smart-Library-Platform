import { Book } from '@/types/book.type';
import BookCardList from '@/components/home/BookCardList';
import Header from '@/components/home/Header';
import Image from 'next/image';
import { headers } from 'next/headers';

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
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
  const res = await fetch(
    `${DEFAULT_BASE}/api/v1/books?pageSize=${pageSize}&page=${page}&genre=${encodeURIComponent(genre)}&${encodeURIComponent(
      searchBy
    )}=${encodeURIComponent(q)}`,
    {
      headers: { cookie },
      next: { tags: [`books:${paramsString}`] },
    }
  );

  let initialData = null;
  if (res.ok) {
    try {
      initialData = await res.json();
    } catch {
      initialData = null;
    }
  } else {
    initialData = null;
  }

  const books: Book[] = initialData?.result?.data || [];
  const total = initialData?.result?.total || 0;
  const pages: number = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex">
      <div className="flex w-full flex-col justify-center gap-6 p-6">
        <Header />
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
