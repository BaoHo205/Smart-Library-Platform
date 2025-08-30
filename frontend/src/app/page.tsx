import HomePage from '@/components/home/Homepage';
import { headers } from 'next/headers';

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const genre = (searchParams?.genre as string) ?? '';
  const page = Number((searchParams?.page as string) ?? '1');
  const searchBy = (searchParams?.searchBy as string) ?? 'title';
  const q = (searchParams?.q as string) ?? '';

  const params = new URLSearchParams();
  if (genre) params.set('genre', genre);
  if (page) params.set('page', String(page));
  if (searchBy) params.set('searchBy', searchBy);
  if (q) params.set('q', q);

  const paramsString = params.toString();

  const headersList = await headers();
  const cookie = headersList.get('cookie') ?? '';

  const res = await fetch(
    `${DEFAULT_BASE}/api/v1/books?pageSize=12&page=${page}&genre=${encodeURIComponent(genre)}&${encodeURIComponent(searchBy)}=${encodeURIComponent(q)}`,
    {
      headers: { cookie },
      // tag-based cache so we can invalidate by this query
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
    // non-OK (401/403/500): return null so client shows empty state or login prompt
    initialData = null;
  }

  return <HomePage initialData={initialData} />;
}
