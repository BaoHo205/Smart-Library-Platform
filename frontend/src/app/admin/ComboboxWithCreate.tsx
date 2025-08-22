// components/ui/combobox-with-create.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component

interface Item {
    id: string;
    label: string;
}

interface ComboboxWithCreateProps {
    items: Item[];
    value: string;
    onValueChange: (value: string) => void;
    onNewItem: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    label: string;
}

export function ComboboxWithCreate({
    items,
    value,
    onValueChange,
    onNewItem,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    label
}: ComboboxWithCreateProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [isCreating, setIsCreating] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateNew = () => {
        if (search.trim()) {
            onNewItem(search.trim());
            setOpen(false);
            setIsCreating(false);
            setSearch("");
        }
    };

    const handleToggleCreate = () => {
        setIsCreating(true);
        setOpen(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <div className="relative flex flex-col space-y-1.5">
            <Label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</Label>
            {isCreating ? (
                <div className="flex items-center space-x-2">
                    <Input
                        id={label.toLowerCase().replace(' ', '-')}
                        ref={inputRef}
                        placeholder={`Enter new ${label.toLowerCase()}`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button type="button" onClick={handleCreateNew}>Create</Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {value
                                ? items.find((item) => item.id === value)?.label
                                : placeholder}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder={searchPlaceholder} onValueChange={setSearch} />
                            <CommandList>
                                {filteredItems.length > 0 ? (
                                    <CommandGroup>
                                        {filteredItems.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.label}
                                                onSelect={() => {
                                                    onValueChange(item.id);
                                                    setOpen(false);
                                                    setSearch("");
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === item.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {item.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ) : (
                                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                                )}
                                <CommandItem onSelect={handleToggleCreate} className="mt-2">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create new {label}
                                </CommandItem>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}