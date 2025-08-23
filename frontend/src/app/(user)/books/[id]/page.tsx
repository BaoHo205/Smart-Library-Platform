import BookInfoPage from '@/components/books/BookInfo';

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-6">
      <BookInfoPage bookId={id} />
    </div>
  );
}
