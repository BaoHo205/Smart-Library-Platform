'use client';
import React, { useEffect } from 'react';

import { columns } from '@/components/admin/books/columns';
import { DataTable } from '@/components/admin/books/data-table';
import axiosInstance from '@/config/axiosConfig';
import { useDataStore } from '@/lib/useDataStore';
import { UserChip } from '@/components/ui/userchip';
import { useAuth } from '@/components/auth/useAuth';

const page = () => {
  const setBooks = useDataStore(s => s.setBooks);
  const setPublishers = useDataStore(s => s.setPublishers);
  const setAuthors = useDataStore(s => s.setAuthors);
  const setGenres = useDataStore(s => s.setGenres);
  const books = useDataStore(s => s.books);
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await axiosInstance.get('/api/v1/books');
        setBooks(bookResponse.data.result.data);

        const authorResponse = await axiosInstance.get('/api/v1/authors');
        setAuthors(authorResponse.data.data);

        const publisherResponse = await axiosInstance.get('/api/v1/publishers');

        setPublishers(publisherResponse.data.data);

        const genreResponse = await axiosInstance.get('/api/v1/genres');
        setGenres(genreResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <div className="flex flex-row justify-between">
        <h1 className="py-3 text-2xl font-bold text-black">My Inventory</h1>
        <UserChip user={user} loading={loading} />
      </div>
      <div>
        <DataTable columns={columns} data={books} />
      </div>
    </div>
  );
};

export default page;
