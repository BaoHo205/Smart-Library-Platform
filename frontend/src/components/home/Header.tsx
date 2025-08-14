'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/home-command';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

const Header = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <header className="flex items-center justify-between">
      <div className="flex h-full gap-5">
        <Command className="h-full w-sm rounded-b-sm border shadow-2xs">
          <CommandInput
            placeholder={'Type a command or search...'}
            value={inputValue}
            onValueChange={setInputValue}
            className="h-full"
          />

          {inputValue && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem>Search Books</CommandItem>
                <CommandItem>Search Authors</CommandItem>
              </CommandGroup>
            </CommandList>
          )}
        </Command>
        <Button className="h-full bg-white text-neutral-900 shadow-sm hover:bg-white">
          Category <ChevronsUpDown />
        </Button>
      </div>
      <div className="flex items-center gap-3 rounded-sm p-3 shadow-sm">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span>Nhat Minh</span>
      </div>
    </header>
  );
};
export default Header;
