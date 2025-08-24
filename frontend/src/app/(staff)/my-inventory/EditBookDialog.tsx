// components/EditBookDialog.tsx
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
<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
} from "@/components/ui/form";
import { Plus, Minus } from "lucide-react";
import { ComboboxWithCreate } from "./ComboboxWithCreate";
import { BookShow } from "./columns";
import { toast } from "sonner"
import axiosInstance from "@/config/axiosConfig";
import { useDataStore } from "@/lib/useDataStore";
=======
} from '@/components/ui/form';
import { Plus, Minus } from 'lucide-react';
import { ComboboxWithCreate } from './ComboboxWithCreate';
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx

export interface Publisher {
  id?: string;
  name: string;
}
export interface Author {
  id?: string;
  firstName: string;
  lastName: string;
}

const formSchema = z.object({
  bookTitle: z
    .string()
    .min(2, { message: 'Book title must be at least 2 characters.' }),
  isbn: z.string().optional(),
<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
  publisher: z.string().min(1, { message: "Publisher is required." }),
  author: z.array(z.string()).min(1, { message: "Author(s) required." }),
  thumbnailLink: z.string().url({ message: "Invalid URL." }).optional(),
  bookQuantity: z.number().min(0, { message: "Quantity cannot be negative." }),
=======
  publisher: z.string().min(1, { message: 'Publisher is required.' }),
  author: z.string().min(1, { message: 'Author is required.' }),
  thumbnailLink: z.string().url({ message: 'Invalid URL.' }).optional(),
  bookQuantity: z.number().min(0, { message: 'Quantity cannot be negative.' }),
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx
  description: z.string().optional(),
});

interface EditBookDialogProps {
  book: BookShow;
}

export const EditBookDialog = ({ book }: EditBookDialogProps) => {
  const [open, setOpen] = useState(false);
  const publisherList = useDataStore((s) => s.publisherList);
  const authorList = useDataStore((s) => s.authorList);
  const addPublisher = useDataStore((s) => s.addPublisher);
  const addAuthor = useDataStore((s) => s.addAuthor);
  const retireBook = useDataStore((s) => s.retireBook)
  const updateQuantity = useDataStore((s) => s.updateQuantity)
  // const [publisherList, setPublisherList] = useState<Publisher[]>([]);
  // const [authorList, setAuthorList] = useState<Author[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
      bookTitle: book.title || "",
      isbn: book.isbn || "",
      publisher: "",
      author: [], // Change this to an empty array
      thumbnailLink: book.thumbnailUrl || "",
      bookQuantity: book.quantity || 0,
      description: book.description || "",
=======
      bookTitle: book.title || '',
      publisher: book.publisher || '',
      author: book.author || '',
      bookQuantity: book.quantity || 0,
      thumbnailLink: book.thumbnail_url || '',
      isbn: '',
      description: '',
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx
    },
  });

  useEffect(() => {
    if (open) {
<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
      // Find the publisher ID from the Zustand store list
      const publisher = publisherList.find(p => p.name === book.publisherName);
      if (publisher) {
        form.setValue("publisher", publisher.id!);
      }

      // Find author IDs from the Zustand store list
      const authorNames = book.authors.split(',');
      const authorIds = authorNames.map(name => {
        const author = authorList.find(a => `${a.firstName} ${a.lastName}` === name.trim());
        return author ? author.id : null;
      }).filter(Boolean) as string[];

      form.setValue("author", authorIds);
=======
      if (book.publisher) {
        setPublisherList([
          {
            id: book.publisher,
            name: book.publisher,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else {
        setPublisherList([]);
      }

      if (book.author) {
        const [firstName = '', ...lastNameParts] = book.author.split(' ');
        const lastName = lastNameParts.join(' ');
        setAuthorList([
          {
            id: book.author,
            firstName,
            lastName,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else {
        setAuthorList([]);
      }
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx
    }
  }, [open, book, publisherList, authorList, form]);

<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
  const handleCreatePublisher = async (name: string) => {
    try {
      const createdPublisher = await axiosInstance.post("/api/v1/publishers/create", { name });

      addPublisher(createdPublisher.data.data[0]);
      const publisherId = createdPublisher.data.data[0].id

      form.setValue("publisher", publisherId);
      toast.success("Publisher created successfully.");
    } catch (error) {
      toast.error("Failed to create publisher: " + error);
    }
  };

  const handleCreateAuthor = async (fullName: string) => {
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    try {
      const created = await axiosInstance.post("/api/v1/authors/create", { firstName, lastName });
      const authorId = created.data.data[0].id

      addAuthor(created.data.data[0]);

      // This is a crucial change: add the new author ID to the existing array
      const currentAuthors = form.getValues("author");
      form.setValue("author", [...currentAuthors, authorId]);

      toast.success("Authorx created successfully.");
    } catch (error) {
      toast.error("Failed to create author: " + error);
    }
=======
  const handleNewPublisher = async (name: string) => {
    console.log('Creating new publisher:', name);
    const newPublisherId = `pub${Date.now()}`;
    const newPublisher = {
      id: newPublisherId,
      name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPublisherList([...publisherList, newPublisher]);
    form.setValue('publisher', newPublisher.id as string);
  };

  const handleNewAuthor = async (fullName: string) => {
    console.log('Creating new author:', fullName);
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    const newAuthorId = `auth${Date.now()}`;
    const newAuthor = {
      id: newAuthorId,
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAuthorList([...authorList, newAuthor]);
    form.setValue('author', newAuthor.id as string);
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Updated values:', { id: book.id, ...values });
    setOpen(false);
  }

<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
  const handleQuantityChange = async (delta: number) => {
    const currentQuantity = form.getValues("bookQuantity");
    const updateQuantity = Math.max(0, currentQuantity + delta)

    form.setValue("bookQuantity", updateQuantity);
=======
  const handleQuantityChange = (delta: number) => {
    const currentQuantity = form.getValues('bookQuantity');
    form.setValue('bookQuantity', Math.max(0, currentQuantity + delta));
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx
  };

  const handleRetireBook = async () => {
    try {
      await axiosInstance.put(`/api/v1/books/retired/${book.id}`);
      toast.success("Book retired successfully.");
      retireBook(book.id);
      setOpen(false);
    } catch (error) {
      console.error("Failed to retire book:", error);
      toast.error("Failed to retire book.");
    }
  }

  const handleUpdateInventory = async () => {
    const currentQuantity = form.getValues("bookQuantity");
    // Call the API to update the inventory
    try {
      const updatedValue = await axiosInstance.put(`/api/v1/books/inventory/${book.id}`, {
        quantity: currentQuantity
      })
      console.log("Inventory updated successfully:", updatedValue.data.data);
      form.reset();
      updateQuantity(book.id, currentQuantity);
      setOpen(false);
      toast.success("Book quantity has been updated successfully.");
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Failed to update inventory.");
    }
  }

  const publisherOptions = publisherList.map(p => ({
    id: p.id!,
    label: p.name,
  }));
  const authorOptions = authorList.map(a => ({
    id: a.id!,
    label: `${a.firstName} ${a.lastName}`,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
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
                        multiple // Add this prop
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
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bookQuantity">Book Quantity</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <FormField
                    control={form.control}
                    name="bookQuantity"
                    render={({ field }) => (
                      <Input
                        id="bookQuantity"
                        type="number"
                        value={field.value}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="w-16 text-center"
                      />
                    )}
                  />
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
              </div>
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
<<<<<<< HEAD:frontend/src/app/admin/EditBookDialog.tsx
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
=======
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
>>>>>>> dev:frontend/src/app/(staff)/my-inventory/EditBookDialog.tsx
                Cancel
              </Button>
              <div className="flex flex-row gap-2">
                <Button type="button" variant="destructive" onClick={() => handleRetireBook()}>Retire</Button>
                <Button type="button" onClick={() => handleUpdateInventory()}>Update Inventory</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
