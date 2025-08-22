'use client'
import React from 'react';
import useUserProfile from '@/hooks/useUserProfile';
import LoanCard from './LoanCard';
import type { CheckoutItem } from '@/types/checkout.type';

const MyLoan: React.FC = () => {
  const userId = localStorage.getItem('userId') || '';
  const { checkouts = [] } = useUserProfile(userId);
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Loans</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {checkouts.length > 0 ? (
          checkouts.map((checkout: CheckoutItem) => <LoanCard key={checkout.bookId} checkout={checkout} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books checked out</h3>
              <p className="text-gray-500">Browse our library to find books to check out.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoan;