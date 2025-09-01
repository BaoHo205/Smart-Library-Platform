// components/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { EditBookDialog } from './EditBookDialog';
import { Badge } from '@/components/ui/badge';
import { BookShow } from './EditBookDialog';

export const columns: ColumnDef<BookShow>[] = [
  {
    accessorKey: 'thumbnailUrl',
    header: 'Book Image',
    cell: ({ row }) => {
      const url = row.getValue('thumbnailUrl') as string;
      return (
        <Image
          src={url}
          alt="Book Thumbnail"
          className="h-16 w-auto rounded-md object-cover"
          width={64}
          height={64}
        />
      );
    },
  },
  {
    accessorKey: 'isbn',
    header: 'ISBN',
  },
  {
    accessorKey: 'title',
    header: 'Book Name',
  },
  {
    accessorKey: 'authors',
    header: 'Book Author',
    cell: ({ row }) => {
      const authors: string[] = (row.getValue('authors') as string).split(', ');
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          {authors.map((author, index) => (
            <Badge key={index} variant="outline" className="truncate">
              {author.trim()}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'publisherName',
    header: 'Publisher',
  },
  {
    accessorKey: 'genres',
    header: 'Genre',
    cell: ({ row }) => {
      const genres: string[] = (row.getValue('genres') as string).split(', ');
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          {genres.map((genre, index) => (
            <Badge key={index} variant="outline" className="truncate">
              {genre.trim()}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'isRetired',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('isRetired') as number;
      const isAvailable = status === 0;
      const stringStatus = isAvailable ? 'available' : 'unavailable';
      return (
        <Badge
          variant="outline"
          className={`${isAvailable ? 'border-green-300 bg-green-100 text-green-800' : 'border-red-300 bg-red-100 text-red-800'}`}
        >
          {stringStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    id: 'edit',
    header: 'Action',
    cell: ({ row }) => {
      const book = row.original;
      return <EditBookDialog book={book} />;
    },
  },
];
