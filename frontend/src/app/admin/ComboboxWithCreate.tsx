// components/ComboboxWithCreate.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

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
    const [inputValue, setInputValue] = React.useState("");

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

    const selectedLabels = (Array.isArray(value) ? value : [value])
        .map(val => items.find(item => item.id === val)?.label)
        .filter(Boolean);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {multiple && value.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selectedLabels.map((label) => (
                                <Badge key={label} variant="secondary">
                                    {label}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        items.find((item) => item.id === value)?.label || placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        onValueChange={setInputValue}
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
                                            Array.isArray(value) && value.includes(item.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {inputValue && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={() => onNewItem(inputValue)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create "{inputValue}"
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};