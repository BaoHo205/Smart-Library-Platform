'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UserChip } from '../ui/userchip';
import { Input } from '../ui/input';
import Combobox from './ComboBox';
import axiosInstance from '@/config/axiosConfig';
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

type Option = { value: string; label: string };

const options: Option[] = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'publisher', label: 'Publisher' },
];

const Header: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchParam = String(searchParams.get('searchBy') ?? 'title');
  const searchInput = String(searchParams.get('q') ?? '');
  const { user, loading: authLoading } = useAuth();
  const [genres, setGenres] = useState<Option[]>([]);
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

  useEffect(() => {
    let mounted = true;
    const fetchGenres = async () => {
      try {
        const response = await axiosInstance.get<Option[]>('/api/v1/genres');
        if (mounted) setGenres(response.data || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
        if (mounted) setGenres([]);
      }
    };
    fetchGenres();
    return () => {
      mounted = false;
    };
  }, []);

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
          <Select value={searchParam} onValueChange={v => setParamAndPush('searchBy', v)}>
            <SelectTrigger className="m-0 h-full w-[10rem] rounded-md bg-neutral-100 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
          options={genres.map(genre => ({ value: genre.value, label: genre.label }))}
          optionName="genre"
          className="h-full w-[12vw] rounded-lg"
          onValueChange={selectedGenre => setParamAndPush('genre', selectedGenre)}
        />
      </div>
      <div className="flex items-center gap-3 rounded-lg border px-2.5 py-1.5 shadow-sm">
        <UserChip user={user} loading={authLoading} />
      </div>
    </header>
  );
};

export default Header;
