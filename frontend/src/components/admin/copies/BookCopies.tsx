"use client"

import React, { useEffect } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useDataStore } from '@/lib/useDataStore';
import axiosInstance from '@/config/axiosConfig';

interface BookCopiesProps {
    id: string;
}

const BookCopies: React.FC<BookCopiesProps> = ({ id }) => {
    const setBookCopies = useDataStore((s) => s.setBookCopies);
    const bookCopies = useDataStore((s) => s.bookCopies);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosInstance.get(`/api/v1/books/${id}/copies`);
                console.log(result.data.result)
                setBookCopies(result.data.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])
    return (
        <div>
            <DataTable columns={columns} data={bookCopies} />
        </div>
    )
}

export default BookCopies;