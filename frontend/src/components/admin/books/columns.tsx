// components/columns.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { EditBookDialog } from "./EditBookDialog"
import { Badge } from "@/components/ui/badge"
import { BookShow } from "./EditBookDialog"

export const columns: ColumnDef<BookShow>[] = [
  {
    accessorKey: "thumbnailUrl",
    header: "Book Image",
    cell: ({ row }) => {
      const url = row.getValue("thumbnailUrl") as string;
      return (
        <img
          src={url}
          alt="Book Thumbnail"
          className="h-16 w-auto rounded-md object-cover"
        />
      );
    },
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
  },
  {
    accessorKey: "title",
    header: "Book Name",
  },
  {
    accessorKey: "authors",
    header: "Book Author",
    cell: ({ row }) => {
      const authors: string[] = (row.getValue("authors") as string).split(", ");
      return (
        <div className="flex flex-col gap-2 items-center">
          {authors.map((author, index) => (
            <Badge key={index} variant="outline">
              {author.trim()}
            </Badge>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: "publisherName",
    header: "Publisher",
  },
  {
    accessorKey: "genres",
    header: "Genre",
    cell: ({ row }) => {
      const genres: string[] = (row.getValue("genres") as string).split(", ");
      return (
        <div className="flex flex-col gap-2 items-center">
          {genres.map((genre, index) => (
            <Badge key={index} variant="outline">
              {genre.trim()}
            </Badge>
          ))}
        </div>
      );

    }
  },
  {
    accessorKey: "isRetired",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("isRetired") as number;
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
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    id: "edit",
    header: "Action",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <EditBookDialog book={book} />
      );
    }
  }
]