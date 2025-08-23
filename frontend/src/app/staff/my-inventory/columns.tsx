// components/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EditBookDialog } from './EditBookDialog';

export type BookShow = {
  thumbnail_url: string;
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: [string];
  quantity: number;
};

export const columns: ColumnDef<BookShow>[] = [
  {
    accessorKey: 'thumbnail_url',
    header: 'Book Image',
    cell: ({ row }) => {
      const url = row.getValue('thumbnail_url') as string;
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
    accessorKey: 'id',
    header: 'Book ID',
  },
  {
    accessorKey: 'title',
    header: 'Book Name',
  },
  {
    accessorKey: 'author',
    header: 'Book Author',
  },
  {
    accessorKey: 'publisher',
    header: 'Publisher',
  },
  {
    accessorKey: 'genre',
    header: 'Genre',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    id: 'edit',
    cell: ({ row }) => {
      const book = row.original;
      return <EditBookDialog book={book} />;
    },
  },
];
