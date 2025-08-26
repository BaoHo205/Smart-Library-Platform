'use client';
import React from 'react';
import useUserProfile from '@/hooks/useUserProfile';
import LoanCard from './LoanCard';
import type { CheckoutItem } from '@/types/checkout.type';

const MyLoan: React.FC = () => {
  const {
    checkouts,
    setCheckouts,
  }: {
    checkouts: CheckoutItem[];
    setCheckouts: React.Dispatch<React.SetStateAction<CheckoutItem[]>>;
  } = useUserProfile();
  const activeCheckouts: CheckoutItem[] = checkouts.filter(
    checkout => !checkout.isReturned
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">My Loans</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeCheckouts.length > 0 ? (
          activeCheckouts.map(checkout => (
            <LoanCard
              key={checkout.bookId}
              checkout={checkout}
              setCheckouts={setCheckouts}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No books checked out
              </h3>
              <p className="text-gray-500">
                Browse our library to find books to check out.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoan;
