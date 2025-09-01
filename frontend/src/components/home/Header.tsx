'use client';

import React, { useState, useCallback } from 'react';
import { UserChip } from '../ui/userchip';
import { Input } from '../ui/input';
import Combobox from './ComboBox';
import debounce from 'lodash.debounce';
import { useAuth } from '../auth/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';

type Option = { id: string; name: string };

const options: Option[] = [
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'publisher', name: 'Publisher' },
];

interface HeaderProps { 
  genres: Option[];
}

const Header: React.FC<HeaderProps> = ({ genres }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchParam = String(searchParams.get('searchBy') ?? 'title');
  const searchInput = String(searchParams.get('q') ?? '');
  const { user, loading: authLoading } = useAuth();
  const [currSearchInput, setCurrSearchInput] = useState<string>(searchInput);

  const debouncedSearchInputChange = useCallback(
    debounce((nextValue: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (!nextValue) params.delete('q');
      else params.set('q', nextValue);
      params.set('page', '1');
      const q = params.toString();
      const url = q ? `?${q}` : '/';
      router.push(url);
    }, 500),
    [searchParams, router]
  );

  const setParamAndPush = (key: string, value: string | null) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === null || value === '') params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    const q = params.toString();
    const url = q ? `?${q}` : '/';
    router.push(url);
  };

  return (
    <header className="flex items-center justify-between">
      <div className="flex h-full gap-5">
        <div className="flex h-full w-[25vw] items-center rounded-lg border p-1.5 shadow-2xs">
          <Select value={searchParam} onValueChange={searchCategory => setParamAndPush('searchBy', searchCategory)}>
            <SelectTrigger className="m-0 h-full w-[10rem] rounded-md bg-neutral-100 font-medium">
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search books, authors, publishers..."
            value={currSearchInput}
            onChange={input => {
              setCurrSearchInput(input.target.value);
              debouncedSearchInputChange(input.target.value);
            }}
            className="h-full rounded-r-none border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Combobox
          options={genres.map(genre => ({ value: genre.id, label: genre.name }))}
          optionName="genre"
          className="h-full w-[12vw] rounded-lg"
          onValueChange={selectedGenre => setParamAndPush('genre', selectedGenre)}
        />
      </div>
      <UserChip user={user} loading={authLoading} />
    </header>
  );
};

export default Header;
