"use client"
import React, { useEffect, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { columns, BookShow } from "./columns"
import { DataTable } from "./data-table"
import axios from 'axios';

const page = () => {
    const [books, setBooks] = useState<BookShow[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<BookShow[]>('http://localhost:5000/api/books');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
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