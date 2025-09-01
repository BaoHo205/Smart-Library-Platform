'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckoutItem } from '@/types/checkout.type';
import { format, parseISO, isValid } from 'date-fns';
import { borrowBook } from '@/api/checkout.api';
import { toast } from 'sonner';

const PastLoanCard = ({
  checkout,
  isBorrowing,
}: {
  checkout: CheckoutItem;
  isBorrowing?: boolean;
}) => {
  const router = useRouter();

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

  const handleReborrow = async (bookId: string) => {
    try {
      await borrowBook(bookId);
      toast.success('Book reborrowed successfully!');
      router.refresh();
    } catch (err) {
      console.error('Reborrow failed', err);
      toast.error('Failed to reborrow book');
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
          src={checkout.bookThumbnail || '/default-image.png'}
          width={100}
          height={100}
          alt={'title'}
          className="aspect-[5/6] w-full rounded-none"
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex w-full flex-col items-start">
          <span className="text-muted-foreground text-xs">Returned Date: </span>
          <div className="flex w-full justify-between">
            <span className="text-s font-bold">
              {formatDateDMY(checkout.returnDate)}
            </span>
            <Badge
              variant={'secondary'}
              className={`bg-${checkout.isLate ? 'red' : 'green'}-100 text-${checkout.isLate ? 'red' : 'green'}-600 text-s`}
            >
              {checkout.isLate ? 'Late' : 'On time'}
            </Badge>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Button
            onClick={() => {
              handleReborrow(checkout.bookId);
            }}
            disabled={isBorrowing}
          >
            Reborrow
          </Button>
          <Button
            variant={'outline'}
            onClick={() => {
              router.push(`/books/${checkout.bookId}`);
            }}
          >
            Review
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PastLoanCard;
