'use client';
import { useEffect, useState, useCallback } from 'react';
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

interface Options {
  value: string;
  label: string;
}

interface HeaderProps {
  onCurrentGenreChange: (genre: string) => void;
  onSearchParamChange: (param: string) => void;
  onSearchInputChange: (input: string) => void; // Add input change handler
  searchParam: string;
  searchInput: string;
  currentGenre: string;
}

const options: Options[] = [
  {
    value: 'title',
    label: 'Title',
  },
  {
    value: 'author',
    label: 'Author',
  },
  {
    value: 'publisher',
    label: 'Publisher',
  },
];

const Header: React.FC<HeaderProps> = ({
  onCurrentGenreChange,
  onSearchParamChange,
  onSearchInputChange,
  searchParam,
  searchInput,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [genres, setGenres] = useState<Options[]>([]);
  const [currSearchInput, setCurrSearchInput] = useState<string>(searchInput);
  const debouncedSearchInputChange = useCallback(
    debounce(nextValue => onSearchInputChange(nextValue), 500),
    []
  );

  const fetchGenres = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get('api/v1/genres');
      setGenres(response.data.data as Options[]);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      setGenres([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <header className="flex items-center justify-between">
      <div className="flex h-full gap-5">
        <div className="flex h-full w-[25vw] items-center rounded-lg border p-1.5 shadow-2xs">
          <Select value={searchParam} onValueChange={onSearchParamChange}>
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
            onChange={e => {
              setCurrSearchInput(e.target.value);
              debouncedSearchInputChange(e.target.value);
            }}
            className="h-full rounded-r-none border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Combobox
          options={genres}
          optionName="genre"
          className="h-full w-[12vw] rounded-lg"
          onValueChange={onCurrentGenreChange}
        />
      </div>
      <div className="flex items-center gap-3 rounded-lg border px-2.5 py-1.5 shadow-sm">
        <UserChip user={user} loading={authLoading} />
      </div>
    </header>
  );
};

export default Header;
