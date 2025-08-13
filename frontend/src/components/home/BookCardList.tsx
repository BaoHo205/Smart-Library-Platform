import BookCard, { BookCardProps } from "./BookCard";
import Link from "next/link";

interface BookCardListProps {
  genre: string;
  books: BookCardProps[];
}

const BookCardList: React.FC<BookCardListProps> = ({ genre, books }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{genre}</h1>
        <Link href={''} className="text-sm hover:font-bold">
          Show all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </div>
    </>
  );
};

export default BookCardList;