'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { AddNewBookDialog } from './AddNewBookDialog';
import BookCopies from '../copies/BookCopies';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const getColumnSpanClass = (columnId: string) => {
  const spanMap: Record<string, string> = {
    thumbnailUrl: 'col-span-1',
    isbn: 'col-span-1',
    title: 'col-span-2',
    authors: 'col-span-2',
    publisherName: 'col-span-1',
    genres: 'col-span-2',
    isRetired: 'col-span-1',
    quantity: 'col-span-1',
    edit: 'col-span-1',
  };
  return spanMap[columnId] || 'col-span-1';
};

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const handleRowClick = (event: React.MouseEvent, bookId: string) => {
    const target = event.target as HTMLElement;
    // Prevent dialog from opening if clicking within the edit column or a dialog
    const isActionColumn = target.closest('[data-column-id="edit"]');
    const isDialogContent = target.closest('.dialog-content'); // Check for dialog content
    if (!isActionColumn && !isDialogContent) {
      setSelectedBookId(bookId);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter book name..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="max-w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="grid grid-cols-12">
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={`flex items-center justify-center ${getColumnSpanClass(header.column.id)}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="grid cursor-pointer grid-cols-12 text-center hover:bg-gray-100"
                  onClick={event => handleRowClick(event, row.original.id)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      data-column-id={cell.column.id}
                      className={`flex items-center justify-center whitespace-normal ${getColumnSpanClass(cell.column.id)}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="grid grid-cols-12">
                <TableCell
                  colSpan={columns.length}
                  className="col-span-10 h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            <TableRow className="grid border-t text-center">
              <TableCell className="col-span-10">
                <AddNewBookDialog />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Book Copies</DialogTitle>
          </DialogHeader>
          {selectedBookId && <BookCopies id={selectedBookId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
