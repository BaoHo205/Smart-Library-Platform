"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/home-command"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const Header = () => {
  const [inputValue, setInputValue] = useState("");

  return <header className="flex justify-between items-center">
    <div className="flex gap-5 h-full">
      <Command className="w-sm rounded-b-sm shadow-2xs h-full border">
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
      <Button className="shadow-sm bg-white text-neutral-900 hover:bg-white h-full">
        Category <ChevronsUpDown />
      </Button>
    </div>
    <div className="flex items-center gap-3 p-3 rounded-sm shadow-sm">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span>Nhat Minh</span>
    </div>
  </header>
}
export default Header;