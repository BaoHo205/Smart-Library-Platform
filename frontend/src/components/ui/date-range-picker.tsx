"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
    className?: string;
    date?: DateRange | undefined;
    onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
    className,
    date,
    onDateChange,
}: DatePickerWithRangeProps) {
    const [internalDate, setInternalDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })

    // use external date if provided, otherwise => use internal state :>
    const currentDate = date !== undefined ? date : internalDate;
    const setCurrentDate = onDateChange || setInternalDate;

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !currentDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentDate?.from ? (
                            currentDate.to ? (
                                <>
                                    {format(currentDate.from, "LLL dd, y")} -{" "}
                                    {format(currentDate.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(currentDate.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={currentDate?.from}
                        selected={currentDate}
                        onSelect={setCurrentDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
