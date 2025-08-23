import Image from 'next/image';
import { Card, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import axiosInstance from '@/config/axiosConfig';
import useUserProfile from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';

export interface BookCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  authors: string;
  genres: string;
  avgRating: number | 4.5;
  availableCopies: number;
}

const BookCard: React.FC<BookCardProps> = ({
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
      const response = await axiosInstance.post(`/api/v1/books/borrow/${id}`, {
        dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      });
      setCheckouts(prevCheckouts => [
        ...prevCheckouts,
        {
          bookId: id,
          bookName: title,
          checkoutDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          returnDate: null,
          isReturned: false,
          isLate: false,
        },
      ]);
      console.log('Book borrowed successfully:', response.data);
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const directToBookDetail = () => {
    router.push(`/books/${id}`);
  };

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
          disabled={checkouts.some(checkout => checkout.bookId === id)}
          className="w-full"
        >
          {checkouts.some(checkout => checkout.bookId === id)
            ? 'Borrowed'
            : 'Borrow'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
