'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckoutItem } from '@/types/checkout.type';
import { format, parseISO, isValid } from 'date-fns';
import { returnBook } from '@/api/checkout.api';
import { toast } from 'sonner';

const ActiveLoanCard = ({
  checkout,
}: {
  checkout: CheckoutItem;
}) => {
  const router = useRouter();
  const [isReturning, setIsReturning] = useState(false);

  const formatDateDMY = (iso?: string | null) => {
    if (!iso) return '—';
    try {
      const d = parseISO(iso);
      if (!isValid(d)) return 'Invalid date';
      return format(d, 'dd/MM/yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const handleReturn = async (copyId: string) => {
    try {
      setIsReturning(true);
      await returnBook(copyId);
      toast.success('Book returned successfully!');
      router.refresh();
    } catch (err) {
      console.error('Return failed', err);
      toast.error('Failed to return book');
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <h1 className="overflow-hidden text-xl font-bold text-nowrap text-ellipsis">
          {checkout.bookName}
        </h1>
        <p className="text-muted-foreground overflow-hidden text-sm text-nowrap text-ellipsis">
          {checkout.bookAuthors}
        </p>
        <div className="flex gap-2">
          {checkout.bookGenres.split(',').map(genre => (
            <Badge variant={'default'} key={genre}>
              {genre}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={checkout.bookThumbnail ||'/default-image.png'}
          width={100}
          height={100}
          alt={'title'}
          className="aspect-[3/2] w-full rounded-none"
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs">Due by</span>
          <span className="text-s font-bold">{formatDateDMY(checkout.dueDate)}</span>
        </div>
        <Button
          onClick={() => {
            handleReturn(checkout.copyId || "");
          }}
          disabled={isReturning}
          className='w-24'
        >
          Return
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActiveLoanCard;
