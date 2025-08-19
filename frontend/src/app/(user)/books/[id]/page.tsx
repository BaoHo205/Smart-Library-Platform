import BookInfoPage from "@/components/books/BookInfo";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <BookInfoPage bookId={id} />
    </div>
  );
}