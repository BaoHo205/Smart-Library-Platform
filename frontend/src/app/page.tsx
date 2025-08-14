import { BookCardProps } from '@/components/home/BookCard';
import BookCardList from '@/components/home/BookCardList';
import Header from '@/components/home/Header';
import Image from 'next/image';

const mockData: BookCardProps[] = [
  {
    title: 'Book Title',
    author: 'Author Name',
    genres: ['Fiction', 'Adventure'],
    imageUrl: '/default-image.png',
    rating: 4.5,
  },
  {
    title: 'Book Title',
    author: 'Author Name',
    genres: ['Fiction', 'Adventure'],
    imageUrl: '/default-image.png',
    rating: 4.5,
  },
  {
    title: 'Book Title',
    author: 'Author Name',
    genres: ['Fiction', 'Adventure'],
    imageUrl: '/default-image.png',
    rating: 4.5,
  },
  {
    title: 'Book Title',
    author: 'Author Name',
    genres: ['Fiction', 'Adventure'],
    imageUrl: '/default-image.png',
    rating: 4.5,
  },
  {
    title: 'Book Title',
    author: 'Author Name',
    genres: ['Fiction', 'Adventure'],
    imageUrl: '/default-image.png',
    rating: 4.5,
  },
  {
    title: 'Book Title',
    author: 'Author Name',
    genres: ['Fiction', 'Adventure'],
    imageUrl: '/default-image.png',
    rating: 4.5,
  },
];

export default function Home() {
  return (
    <div className="flex">
      <div className="flex w-full flex-col justify-center gap-6 p-6">
        <Header />
        <Image
          src="/default-image.png"
          alt="Banner Image"
          width={100}
          height={100}
          className="h-full w-full"
        />
        <BookCardList genre="Health" books={mockData} />
      </div>
    </div>
  );
}
