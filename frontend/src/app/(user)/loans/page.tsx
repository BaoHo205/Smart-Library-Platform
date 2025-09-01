import MyLoan from '../../../components/my-loan/MyLoan';
import { headers } from 'next/headers';

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default async function Loans() {
  const header = await headers();
  const cookie = header.get('cookie') ?? '';

  const res = await fetch(`${DEFAULT_BASE}/api/v1/checkouts`, {
    headers: { cookie },
    credentials: 'include',
    next: { tags: ['checkouts'] },
  });

  const checkouts = await res.json();
  return <MyLoan checkouts={checkouts} />;
}