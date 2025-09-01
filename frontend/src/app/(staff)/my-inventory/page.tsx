'use client';
import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { columns } from '@/components/admin/books/columns';
import { DataTable } from '@/components/admin/books/data-table';
import axiosInstance from '@/config/axiosConfig';
import { useDataStore } from '@/lib/useDataStore';

const page = () => {
  const setBooks = useDataStore(s => s.setBooks);
  const setPublishers = useDataStore(s => s.setPublishers);
  const setAuthors = useDataStore(s => s.setAuthors);
  const setGenres = useDataStore(s => s.setGenres);
  const books = useDataStore(s => s.books);

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
        <div className="flex flex-row items-center justify-center gap-2 rounded-xl border-2 p-3 shadow-xl outline-offset-4">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="user avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>User Name</span>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={books} />
      </div>
    </div>
  );
};

export default page;
