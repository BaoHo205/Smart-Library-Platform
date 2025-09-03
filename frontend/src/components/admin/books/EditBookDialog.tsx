'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ComboboxWithCreate } from './ComboboxWithCreate';
import { toast } from 'sonner';
import axiosInstance from '@/config/axiosConfig';
import { useDataStore } from '@/lib/useDataStore';
import { Minus, Plus } from 'lucide-react';

export interface Publisher {
  id?: string;
  name: string;
}
export interface Author {
  id?: string;
  firstName: string;
  lastName: string;
}
export interface Genre {
  id?: string;
  name: string;
}
export interface BookShow {
  id: string;
  title: string;
  isbn: string;
  publisherName: string;
  authors: string;
  genres: string;
  pageCount: number;
  thumbnailUrl: string;
  quantity: number;
  description: string;
  avgRating: string;
}

const formSchema = z.object({
  bookTitle: z
    .string()
    .min(2, { message: 'Book title must be at least 2 characters.' }),
  isbn: z
    .string({ message: 'ISBN is required' })
    .min(5, { message: 'ISBN is at least 5 chars.' }),
  publisher: z.string().min(1, { message: 'Publisher is required.' }),
  author: z
    .array(z.string())
    .min(1, { message: 'At least one author is required.' }),
  genre: z
    .array(z.string())
    .min(1, { message: 'At least one genre is required.' }),
  pageCount: z
    .number()
    .min(0, { message: 'Page count cannot be negative.' })
    .optional(),
  thumbnailLink: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  description: z
    .string({ message: 'Book description is required.' })
    .min(200, { message: 'Book description must above 200 chars' }),
  avgRating: z
    .number()
    .min(0, { message: 'Rating cannot be negative.' })
    .max(5, { message: 'Rating cannot be more than 5.' })
    .optional(),
});

interface EditBookDialogProps {
  book: BookShow;
}

export const EditBookDialog = ({ book }: EditBookDialogProps) => {
  const [open, setOpen] = useState(false);
  const publisherList = useDataStore(s => s.publisherList);
  const authorList = useDataStore(s => s.authorList);
  const genreList = useDataStore(s => s.genreList);
  const addPublisher = useDataStore(s => s.addPublisher);
  const addAuthor = useDataStore(s => s.addAuthor);
  const retireBook = useDataStore(s => s.retireBook);
  const setBookCopies = useDataStore(s => s.setBookCopies);
  const bookCopies = useDataStore(s => s.bookCopies);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookTitle: book.title || '',
      isbn: book.isbn || '',
      publisher: '',
      author: [],
      genre: [],
      pageCount: book.pageCount || 0,
      thumbnailLink: book.thumbnailUrl || '',
      description: book.description || '',
      avgRating: parseFloat(book.avgRating) || 0,
    },
  });

  useEffect(() => {
    if (open) {
      const publisher = publisherList.find(p => p.name === book.publisherName);
      if (publisher) {
        form.setValue('publisher', publisher.id!);
      }
      const authorNames = book.authors.split(',');
      const authorIds = authorNames
        .map(name => {
          const author = authorList.find(
            a => `${a.firstName} ${a.lastName}` === name.trim()
          );
          return author ? author.id : null;
        })
        .filter(Boolean) as string[];
      form.setValue('author', authorIds);
      const genreNames = book.genres.split(',');
      const genreIds = genreNames
        .map(name => {
          const genre = genreList.find(g => g.name === name.trim());
          return genre ? genre.id : null;
        })
        .filter(Boolean) as string[];
      form.setValue('genre', genreIds);
      form.setValue('avgRating', parseFloat(book.avgRating) || 0);
    }
  }, [open, book, publisherList, authorList, genreList, form]);

  // --- API Call for Fetching Data on Component Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get(`/api/v1/books/${book.id}/copies`);
        setBookCopies(result.data.result);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch book copies.');
      }
    };
    fetchData();
  }, [book.id, setBookCopies]);

  const handleCreatePublisher = async (name: string) => {
    try {
      const createdPublisher = await axiosInstance.post(
        '/api/v1/publishers/create',
        { name }
      );
      addPublisher(createdPublisher.data.data[0]);
      const publisherId = createdPublisher.data.data[0].id;
      form.setValue('publisher', publisherId);
      toast.success('Publisher created successfully.');
    } catch (error) {
      toast.error('Failed to create publisher: ' + error);
    }
  };

  const handleCreateAuthor = async (fullName: string) => {
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    try {
      const created = await axiosInstance.post('/api/v1/authors/create', {
        firstName,
        lastName,
      });
      const authorId = created.data.data[0].id;
      addAuthor(created.data.data[0]);
      const currentAuthors = form.getValues('author');
      form.setValue('author', [...currentAuthors, authorId]);
      toast.success('Author created successfully.');
    } catch (error) {
      toast.error('Failed to create author: ' + error);
    }
  };

  const handleCreateGenre = async (name: string) => {
    try {
      const created = await axiosInstance.post('/api/v1/genres/create', {
        name,
      });
      const genreId = created.data.data[0].id;
      const currentGenres = form.getValues('genre');
      form.setValue('genre', [...currentGenres, genreId]);
      toast.success('Genre created successfully.');
    } catch (error) {
      toast.error('Failed to create genre: ' + error);
    }
  };

  const handlePageChange = (delta: number) => {
    const currentPage = form.getValues('pageCount') as number;
    form.setValue('pageCount', Math.max(0, currentPage + delta));
  };

  const handleRatingChange = (delta: number) => {
    const currentRating = form.getValues('avgRating') as number;
    const newRating = Math.max(0, Math.min(5, currentRating + delta));
    form.setValue('avgRating', Number(newRating.toFixed(1)));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        title: values.bookTitle,
        thumbnailUrl: values.thumbnailLink,
        isbn: values.isbn,
        pageCount: values.pageCount,
        publisherId: values.publisher,
        description: values.description,
        authorIds: values.author.join(','),
        genreIds: values.genre.join(','),
        avgRating: values.avgRating,
      };
      await axiosInstance.put(`/api/v1/books/update/${book.id}`, payload);
      toast.success('Book updated successfully.');
      setOpen(false);
    } catch (error) {
      console.error('Failed to update book:', error);
      toast.error('Failed to update book.');
    }
  };

  const handleRetireBook = async () => {
    try {
      await axiosInstance.put(`/api/v1/books/retired/${book.id}`);
      toast.success('Book retired successfully.');
      retireBook(book.id);
      setOpen(false);
    } catch (error) {
      console.error('Failed to retire book:', error);
      toast.error('Failed to retire book.');
    }
  };

  const publisherOptions = publisherList.map(p => ({
    id: p.id!,
    label: p.name,
  }));
  const authorOptions = authorList.map(a => ({
    id: a.id!,
    label: `${a.firstName} ${a.lastName}`,
  }));
  const genreOptions = genreList.map(g => ({
    id: g.id!,
    label: g.name,
  }));

  const isRetireDisabled = bookCopies.some(copy => copy.isBorrowed === 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto sm:max-w-xl"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Book: {book.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bookTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboboxWithCreate
                        items={publisherOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        onNewItem={handleCreatePublisher}
                        placeholder="Select or add publisher..."
                        searchPlaceholder="Search publisher..."
                        emptyMessage="No publisher found."
                        label="Publisher"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboboxWithCreate
                        items={authorOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        onNewItem={handleCreateAuthor}
                        placeholder="Select or add author..."
                        searchPlaceholder="Search author..."
                        emptyMessage="No author found."
                        label="Author"
                        multiple
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboboxWithCreate
                        items={genreOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        onNewItem={handleCreateGenre}
                        placeholder="Select or add genre..."
                        searchPlaceholder="Search genre..."
                        emptyMessage="No genre found."
                        label="Genre"
                        multiple
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="thumbnailLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="pageCount">Book Pages</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(-1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input
                          id="pageCount"
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          className="w-16 text-center"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="avgRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="avgRating">Average Rating</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRatingChange(-0.1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input
                          id="avgRating"
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          className="w-16 text-center"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRatingChange(0.1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <div className="flex flex-row gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRetireBook}
                  disabled={isRetireDisabled}
                >
                  Retire
                </Button>
                <Button type="submit">Update Book</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
