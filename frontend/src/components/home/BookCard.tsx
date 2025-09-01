import Image from 'next/image';
import { Card, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import useUserProfile from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { CheckoutItem } from '../../types/checkout.type';
import { Book } from '@/types/book.type';
import { borrowBook } from '@/api/checkout.api';
import { toast } from 'sonner';

const BookCard: React.FC<Book> = ({
  id,
  title,
  authors,
  genres,
  thumbnailUrl,
  avgRating,
  availableCopies,
}) => {
  const { checkouts, setCheckouts } = useUserProfile();
  const router = useRouter();

  const handleBorrow = async () => {
    try {
      await borrowBook(id);
      setCheckouts(prevCheckouts => [
        ...prevCheckouts,
        {
          bookId: id,
          bookName: title,
          bookAuthors: authors,
          bookGenres: genres,
          checkoutDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          isReturned: 0,
          isLate: 0,
        } as CheckoutItem,
      ]);
      router.refresh();
      toast.success('Book borrowed successfully!');
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast.error('Failed to borrow book');
    }
  };

  const directToBookDetail = () => {
    router.push(`/books/${id}`);
  };

  const isAlreadyBorrowed = checkouts.some(
    checkout => checkout.bookId === id && !checkout.isReturned
  );

  const isOutOfStock = availableCopies === 0;

  return (
    <Card
      onClick={directToBookDetail}
      className="mx-auto w-full max-w-lg overflow-hidden pt-0 hover:cursor-pointer"
    >
      <CardContent className="p-0">
        <Image
          src={thumbnailUrl}
          width={100}
          height={100}
          alt={title}
          className="aspect-[5/6] w-full rounded-none"
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full max-w-full flex-col gap-1">
          <div className="flex gap-2">
            {genres.split(',').map(genre => (
              <Badge variant={'default'} key={genre}>
                {genre.trim()}
              </Badge>
            ))}
          </div>
          <h1 className="overflow-hidden text-xl font-bold text-nowrap text-ellipsis">
            {title}
          </h1>
          <p className="text-muted-foreground overflow-hidden text-sm text-nowrap text-ellipsis">
            {authors}
          </p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={18} />
            <span className="text-sm font-bold">{avgRating}</span>
          </div>
          <span className="text-muted-foreground text-sm">
            {availableCopies > 0
              ? `${availableCopies} ${availableCopies === 1 ? 'copy' : 'copies'} available`
              : 'Out of stock'}
          </span>
        </div>
        <Button
          onClick={e => {
            e.stopPropagation();
            handleBorrow();
          }}
          disabled={isAlreadyBorrowed || isOutOfStock}
          className="w-full"
        >
          {isAlreadyBorrowed
            ? 'Borrowed'
            : isOutOfStock
              ? 'Unavailable'
              : 'Borrow'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
