'use client';
import { useEffect, useState, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import Combobox from './ComboBox';
import axiosInstance from '@/config/axiosConfig';
import debounce from 'lodash.debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  }
];

const Header: React.FC<HeaderProps> = ({
  onCurrentGenreChange,
  onSearchParamChange,
  onSearchInputChange,
  searchParam,
  searchInput
}) => {
  const [genres, setGenres] = useState<Options[]>([]);
  const [currSearchInput, setCurrSearchInput] = useState<string>(searchInput);
  const debouncedSearchInputChange = useCallback(debounce((nextValue) => onSearchInputChange(nextValue), 500), []);

  const fetchGenres = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Options[]>('api/v1/genres');
      setGenres(response.data);
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
        <div className="flex items-center h-full w-[25vw] rounded-lg border shadow-2xs p-1.5">
          <Select value={searchParam} onValueChange={onSearchParamChange}>
            <SelectTrigger className="w-[10rem] h-full rounded-md m-0 bg-neutral-100 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search books, authors, publishers..."
            value={currSearchInput}
            onChange={(e) => {
              setCurrSearchInput(e.target.value);
              debouncedSearchInputChange(e.target.value);
            }}
            className="h-full border-0 focus-visible:ring-0 rounded-r-none shadow-none"
          />
        </div>
        <Combobox
          options={genres}
          optionName='genre'
          className='h-full w-[12vw] rounded-lg'
          onValueChange={onCurrentGenreChange}
        />
      </div>
      <div className="flex items-center gap-3 rounded-lg py-1.5 px-2.5 shadow-sm border">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className='text-sm font-medium'>Nhat Minh</span>
      </div>
    </header>
  );
};

export default Header;