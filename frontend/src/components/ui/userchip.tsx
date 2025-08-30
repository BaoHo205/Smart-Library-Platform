'use client';

import { Avatar } from '@/components/ui/avatar';

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'staff';
  name?: string;
  avatarUrl?: string | null;
}

interface UserChipProps {
  user?: User | null;
  loading?: boolean;
}

export function UserChip({ user, loading }: UserChipProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
            ?
          </div>
        </Avatar>
        <span className="text-sm font-medium text-gray-500">Hacker</span>
      </div>
    );
  }

  const displayName =
    user.name || `${user.firstName} ${user.lastName}` || user.userName;
  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.userName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
            {initials}
          </div>
        )}
      </Avatar>
      <span className="text-sm font-medium text-gray-900">{displayName}</span>
    </div>
  );
}
