'use server';

import { cookies } from 'next/headers';

const COOKIE_ROLE = 'userRole';
const COOKIE_ID = 'userId';

export async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  const userRoleStr = cookieStore.get(COOKIE_ROLE)?.value;
  if (!userRoleStr) return null;

  return userRoleStr;
}

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_ID)?.value;
  if (!userId) return null;

  return userId;
}
