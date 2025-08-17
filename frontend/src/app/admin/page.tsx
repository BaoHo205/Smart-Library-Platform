"use client"
import React, { useEffect, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { columns, BookShow } from "./columns"
import { DataTable } from "./data-table"
import axiosInstance from '@/config/axiosConfig';
import { useDataStore } from '@/lib/useDataStore';

const page = () => {
    const [books, setBooks] = useState<BookShow[]>([]);
    // const token = localStorage.getItem("accessToken");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzFmNDY3Yy0wNzVjLTQ4ZjktYjc2Yi1lNTYwYTkxZDhlMGMiLCJyb2xlIjoidXNlciIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTUwOTc4MDQsImV4cCI6MTc1NTA5OTYwNH0.higNS8V7qKn5ZiWFKxt0NSOM-IlpUD4d3xfS0PtnlfA";
    const setPublishers = useDataStore((s) => s.setPublishers);
    const setAuthors = useDataStore((s) => s.setAuthors);
    const setGenres = useDataStore((s) => s.setGenres);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookResponse = await axiosInstance.get('/api/v1/books',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                setBooks(bookResponse.data.result.data);

                const authorResponse = await axiosInstance.get('/api/v1/authors',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                setAuthors(authorResponse.data.data);

                const publisherResponse = await axiosInstance.get('/api/v1/publishers',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );

                setPublishers(publisherResponse.data.data);

                const genreResponse = await axiosInstance.get('/api/v1/genres',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                setGenres(genreResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className=' min-w-max p-5'>
            <div className='flex flex-row justify-between'>
                <h1 className='py-3 text-black text-2xl font-bold'>My Inventory</h1>
                <div className="flex flex-row justify-center items-center p-3 gap-2 rounded-xl border-2 outline-offset-4 shadow-xl">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="user avatar" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>User Name</span>
                </div>
            </div>
            <div>
                <DataTable columns={columns} data={books} />
            </div>
        </div>
    )
}

export default page