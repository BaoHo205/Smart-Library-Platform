'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { columns, BookShow } from './columns';
import { DataTable } from './data-table';
import axiosInstance from '@/config/axiosConfig';

const page = () => {
  const [books, setBooks] = useState<BookShow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<BookShow[]>('/api/v1/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-w-max p-5">
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
