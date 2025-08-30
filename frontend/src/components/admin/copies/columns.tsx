// components/columns.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Copies = {
    id: string
    isBorrowed: number // 0 = available, 1 = unavailable
}

export const columns = (onDelete: (copyId: string) => Promise<void>) => {
    return [
        {
            accessorKey: "id",
            header: "Book ID",
        },
        {
            accessorKey: "isBorrowed",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("isBorrowed") as number
                const isAvailable = status === 0
                return (
                    <Badge
                        variant="outline"
                        className={
                            isAvailable
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                        }
                    >
                        {isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                )
            },
        },
        {
            id: "action",
            header: "Action",
            cell: ({ row }) => {
                const copy = row.original
                const isAvailable = copy.isBorrowed === 0
                return (
                    <Button
                        variant="destructive"
                        onClick={() => onDelete(copy.id)}
                        disabled={!isAvailable} // disable if unavailable
                    >
                        Delete
                    </Button>
                )
            },
        },
    ] as ColumnDef<Copies>[]
}
