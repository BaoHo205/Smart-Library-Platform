// components/columns.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Copies = {
    id: string,
    isBorrowed: number
}

export const columns: ColumnDef<Copies>[] = [
    {
        accessorKey: "id",
        header: "Book ID"
    },
    {
        accessorKey: "isBorrowed",
        header: "Is Available",
        cell: ({ row }) => {
            const status = row.getValue("isBorrowed") as number;
            const isAvailable = status === 1;
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
            const book = row.original;
            return (
                <Button variant={"destructive"}>Retire</Button>
            );
        }
    }
]