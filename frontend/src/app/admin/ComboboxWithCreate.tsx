// components/ComboboxWithCreate.tsx
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
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Item {
    id: string;
    label: string;
}

interface ComboboxProps {
    items: Item[];
    value: string[] | string; // Accept an array or a single string
    onValueChange: (value: string[] | string) => void; // Accept an array or a single string
    onNewItem: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    label: string;
    multiple?: boolean; // New prop for multi-select
}

export const ComboboxWithCreate = ({
    items,
    value,
    onValueChange,
    onNewItem,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    label,
    multiple = false, // Default to false
}: ComboboxProps) => {
    const [open, setOpen] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const inputRef = React.useRef(null);

    const handleSelect = (currentValue: string) => {
        if (multiple) {
            const currentArrayValue = Array.isArray(value) ? value : [];
            if (currentArrayValue.includes(currentValue)) {
                onValueChange(currentArrayValue.filter((v) => v !== currentValue));
            } else {
                onValueChange([...currentArrayValue, currentValue]);
            }
        } else {
            onValueChange(currentValue === value ? "" : currentValue);
            setOpen(false);
        }
    };

    // Handler to toggle the creation mode
    const handleToggleCreate = () => {
        setOpen(false);
        setIsCreating(true);
    };

    // Handler for creating a new item
    const handleCreateNew = () => {
        if (search.trim() !== "") {
            onNewItem(search);
            setSearch("");
            setIsCreating(false);
        }
    };

    const selectedLabels = (Array.isArray(value) ? value : [value])
        .map(val => items.find(item => item.id === val)?.label)
        .filter(Boolean);

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
                            {multiple && selectedLabels.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {selectedLabels.map((label) => (
                                        <Badge key={label} variant="secondary">
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                // Display the selected single item or placeholder
                                items.find((item) => item.id === value)?.label || placeholder
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            {/* onValueChange is used to track the user's input */}
                            <CommandInput
                                placeholder={searchPlaceholder}
                                onValueChange={setSearch}
                            />
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.label}
                                            onSelect={() => handleSelect(item.id)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    Array.isArray(value) && value.includes(item.id)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {item.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={handleToggleCreate}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create New {label}
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};
