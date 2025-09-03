'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { Plus, Minus } from 'lucide-react';
import { ComboboxWithCreate } from './ComboboxWithCreate';
import axiosInstance from '@/config/axiosConfig';
import { useDataStore } from '@/lib/useDataStore';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/useAuth';

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
  thumbnailLink: z.string().url({ message: 'Invalid URL.' }).optional(),
  bookQuantity: z
    .number({ message: 'Quantity is required.' })
    .min(1, { message: 'Quantity cannot be negative.' }),
  description: z
    .string({ message: 'Book description is required.' })
    .min(200, { message: 'Book description must above 200 chars' }),
  pageCount: z
    .number({ message: 'Page count is required.' })
    .min(10, { message: 'The number of book pages is larger than 10' }),
  avgRating: z
    .number({ message: 'Average rating is required.' })
    .min(0, { message: 'Rating cannot be negative.' })
    .max(5, { message: 'Rating cannot exceed 5.' }),
});

export const AddNewBookDialog = () => {
  const [open, setOpen] = useState(false);
  const publisherList = useDataStore(s => s.publisherList);
  const authorList = useDataStore(s => s.authorList);
  const genreList = useDataStore(s => s.genreList);
  const addPublisher = useDataStore(s => s.addPublisher);
  const addAuthor = useDataStore(s => s.addAuthor);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookTitle: '',
      isbn: '',
      publisher: '',
      author: [],
      genre: [],
      thumbnailLink: '',
      bookQuantity: 0,
      description: '',
      pageCount: 0,
      avgRating: 0, // Added default value for avgRating
    },
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Submitting values:', values);
    try {
      const newBookData = {
        title: values.bookTitle,
        thumbnailUrl: values.thumbnailLink || null,
        isbn: values.isbn || null,
        quantity: values.bookQuantity,
        pageCount: values.pageCount,
        publisherId: values.publisher,
        description: values.description || null,
        status: 'available',
        authorIds: values.author.join(','),
        genreIds: values.genre.join(','),
        avgRating: 0.0, // Added avgRating to the payload
        staffId: user?.id,
      };
      const response = await axiosInstance.post(
        '/api/v1/books/add',
        newBookData
      );
      console.log('Book created successfully:', response.data);
      form.reset();
      setOpen(false);
      toast.success('Book added successfully!'); // Added success toast
    } catch (error) {
      console.error('Error creating new book:', error);
      toast.error('Failed to add book.'); // Added error toast
    }
  };

  const handleQuantityChange = (delta: number) => {
    const currentQuantity = form.getValues('bookQuantity');
    form.setValue('bookQuantity', Math.max(0, currentQuantity + delta));
  };

  const handlePageChange = (delta: number) => {
    const currentPage = form.getValues('pageCount');
    form.setValue('pageCount', Math.max(0, currentPage + delta));
  };

  const handleRatingChange = (delta: number) => {
    const currentRating = form.getValues('avgRating');
    const newRating = Math.max(0, Math.min(5, currentRating + delta)); // Clamp between 0 and 5
    form.setValue('avgRating', Number(newRating.toFixed(1))); // Format to one decimal place
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
    label: `${g.name}`,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Add New Book</Button>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add new Book</DialogTitle>
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
                      <Input placeholder="Enter book title..." {...field} />
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
                      <Input placeholder="Enter ISBN..." {...field} />
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
            <div className="grid grid-cols-1 gap-4">
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
                        placeholder="Select or add author(s)..."
                        searchPlaceholder="Search author(s)..."
                        emptyMessage="No author found."
                        label="Author"
                        multiple // Enable multi-select for authors
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
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
                        onNewItem={() => {}}
                        placeholder="Select or add genre(s)..."
                        searchPlaceholder="Search genre(s)..."
                        emptyMessage="No genre found."
                        label="Genre"
                        multiple // Enable multi-select for authors
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
                      <Input placeholder="Enter thumbnail link..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="bookQuantity">Book Quantity</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input
                          id="bookQuantity"
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
                        onClick={() => handleQuantityChange(1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <Textarea
                      placeholder="Enter book description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add new Book</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
