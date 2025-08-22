import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import axiosInstance from '@/config/axiosConfig';
import useUserProfile from '@/hooks/useUserProfile';

export interface BookCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  authors: string;
  genres: string;
  avgRating: number | 4.5;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  authors,
  genres,
  // thumbnailUrl,
  avgRating,
}) => {
  const userId = localStorage.getItem('userId') as string;
  const { checkouts, setCheckouts } = useUserProfile(userId);

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

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <h1 className="overflow-hidden text-xl font-bold text-nowrap text-ellipsis">
          {title}
        </h1>
        <p className="text-muted-foreground overflow-hidden text-sm text-nowrap text-ellipsis">
          {authors}
        </p>
        <div className="flex gap-2">
          {/* {genres.map(genre => (
            <Badge variant={'default'} key={genre}>
              {genre}
            </Badge>
          ))} */}
          {genres.split(',').map(genre => (
            <Badge variant={'default'} key={genre}>
              {genre.trim()}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={'/default-image.png'}
          width={100}
          height={100}
          alt={title}
          className="aspect-[3/2] w-full rounded-none"
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <Star size={18} />
          <span className="text-xs font-bold">{avgRating}/5</span>
        </div>
        <Button
          onClick={handleBorrow}
          disabled={checkouts.some(checkout => checkout.bookId === id)}
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
