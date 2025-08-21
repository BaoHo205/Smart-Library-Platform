'use server';

import { cookies } from 'next/headers';

const COOKIE_ROLE = 'userRole';

export async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  const userRoleStr = cookieStore.get(COOKIE_ROLE)?.value;
  if (!userRoleStr) return null;

  return userRoleStr;
}
