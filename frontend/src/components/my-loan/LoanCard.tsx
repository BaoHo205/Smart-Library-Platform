import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckoutItem } from '@/types/checkout.type';
import { format, parseISO, isValid } from 'date-fns';
import { returnBook } from '@/api/checkout.api';

const LoanCard = ({ checkout, setCheckouts }: { checkout: CheckoutItem; setCheckouts: React.Dispatch<React.SetStateAction<CheckoutItem[]>> }) => {
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

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <h1 className="text-xl font-bold text-ellipsis text-nowrap overflow-hidden">{checkout.bookName}</h1>
        <p className="text-muted-foreground text-sm text-ellipsis text-nowrap overflow-hidden">{checkout.bookAuthors}</p>
        <div className="flex gap-2">
          {checkout.bookGenres.split(',').map((genre) => (
            <Badge variant={'default'} key={genre}>
              {genre}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={'/default-image.png'}
          width={100}
          height={100}
          alt={'title'}
          className="aspect-[3/2] w-full rounded-none"
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="text-xs font-bold">{`Due by ${formatDateDMY(checkout.dueDate)}`}</span>
        </div>
        <Button onClick={() => { returnBook(checkout.bookId); setCheckouts((prev) => prev.filter((c) => c.bookId !== checkout.bookId)); }} disabled={false}>Return</Button>
      </CardFooter>
    </Card>
  );
};

export default LoanCard;
