// components/columns.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Copies = {
    id: string,
    isBorrowed: number
}

export const columns = (onDelete: (copyId: string) => Promise<void>) => {
    return [
        {
            accessorKey: "id",
            header: "Book ID"
        },
        {
            accessorKey: "isBorrowed",
            header: "Is Available",
            cell: ({ row }) => {
                const status = row.getValue("isBorrowed") as number;
                const isAvailable = status === 0;
                const stringStatus = isAvailable ? "available" : "unavailable"
                return (
                    <Badge
                        variant="outline"
                        className={`${isAvailable ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
                    >
                        {stringStatus}
                    </Badge>
                );
            },
        },
        {
            id: "edit",
            header: "Action",
            cell: ({ row }) => {
                const copy = row.original;
                // We call the onDelete function with the book copy's ID.
                return (
                    <Button
                        variant={"destructive"}
                        onClick={() => onDelete(copy.id)}
                    >
                        Delete
                    </Button>
                );
            }
        }
    ] as ColumnDef<Copies>[];
}