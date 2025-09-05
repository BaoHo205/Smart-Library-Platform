'use client';

// components/BookCopies.tsx

import React, { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useDataStore } from '@/lib/useDataStore';
import axiosInstance from '@/config/axiosConfig';
import { toast } from 'sonner';

interface BookCopiesProps {
  id: string;
}
interface BookCopy {
  id: string;
  isBorrowed: number;
}

const BookCopies: React.FC<BookCopiesProps> = ({ id }) => {
  const setBookCopies = useDataStore(s => s.setBookCopies);
  const bookCopies = useDataStore(s => s.bookCopies);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // --- API Call for Fetching Data on Component Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get(`/api/v1/books/${id}/copies`);
        setBookCopies(result.data.result);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch book copies.');
      }
    };
    fetchData();
  }, [id, setBookCopies]);

  // --- Delete a book copy by ID ---
  const handleDeleteCopy = async (copyId: string) => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/api/v1/books/copy/delete/${copyId}`);
      // Optimistically update the UI by filtering the deleted item
      setBookCopies(bookCopies.filter(copy => copy.id !== copyId));
      toast.success('Book copy deleted successfully!');
    } catch (error) {
      console.error('Error deleting book copy:', error);
      const errorMessage =
        (error as any).response?.data?.message || 'Failed to delete book copy.';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Add a new book copy ---
  const handleAddCopy = async () => {
    setIsAdding(true);
    try {
      const response = await axiosInstance.post(
        `/api/v1/books/copy/create/${id}`
      );
      // Add the newly created copy to the existing state
      const newCopy = response.data.data;
      setBookCopies([...bookCopies, newCopy]);
      toast.success('New book copy added successfully!');
    } catch (error) {
      console.error('Error adding new book copy:', error);
      const errorMessage =
        (error as any).response?.data?.message ||
        'Failed to add a new book copy.';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  // --- Create the columns using the handler functions ---
  const newCol = columns(handleDeleteCopy);

  return (
    <div>
      <DataTable
        columns={newCol}
        data={bookCopies}
        onAddClick={handleAddCopy}
        isAdding={isAdding}
      />
    </div>
  );
};

export default BookCopies;
