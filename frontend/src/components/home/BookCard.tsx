import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';

export interface BookCardProps {
  title: string;
  author: string;
  genres: string[];
  imageUrl: string;
  rating: number;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  genres,
  imageUrl,
  rating,
}) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm">{author}</p>
        <div className="flex gap-2">
          {genres.map(genre => (
            <Badge variant={'default'} key={genre}>
              {genre}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={imageUrl || '/default-image.png'}
          width={100}
          height={100}
          alt={title}
          className="aspect-[3/2] w-full rounded-none"
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <Star size={18} />
          <span className="text-xs font-bold">{rating}/5</span>
        </div>
        <Button>Borrow</Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
