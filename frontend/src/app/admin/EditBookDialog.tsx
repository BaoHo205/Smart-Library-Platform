// components/EditBookDialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Minus } from "lucide-react";
import { ComboboxWithCreate } from "./ComboboxWithCreate";
import { BookShow } from "./columns";
import axiosInstance from "@/config/axiosConfig";
import { useDataStore } from "@/lib/useDataStore";

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
  bookTitle: z.string().min(2, { message: "Book title must be at least 2 characters." }),
  isbn: z.string().optional(),
  publisher: z.string().min(1, { message: "Publisher is required." }),
  author: z.array(z.string()).min(1, { message: "Author(s) required." }),
  thumbnailLink: z.string().url({ message: "Invalid URL." }).optional(),
  bookQuantity: z.number().min(0, { message: "Quantity cannot be negative." }),
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
  // const [publisherList, setPublisherList] = useState<Publisher[]>([]);
  // const [authorList, setAuthorList] = useState<Author[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookTitle: book.title || "",
      isbn: book.isbn || "",
      publisher: "",
      author: [], // Change this to an empty array
      thumbnailLink: book.thumbnailUrl || "",
      bookQuantity: book.quantity || 0,
      description: book.description || "",
    },
  });

  useEffect(() => {
    if (open) {
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
    }
  }, [open, book, publisherList, authorList, form]);

  const handleCreatePublisher = async (name: string) => {
    const createdPublisher = await axiosInstance.post("api/v1/publishers/create", {
      name: name,
    });
    console.log(createdPublisher.data.data[0]);
    addPublisher(createdPublisher.data.data[0]);
    const id = createdPublisher.data.data[0].id
    console.log(id)
    form.setValue("publisher", id);
  };

  const handleCreateAuthor = async (
    fullName: string
  ) => {
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const created = await axiosInstance.post("api/v1/authors/create", {
      firstName: firstName,
      lastName: lastName
    });

    const id = created.data.data[0].id

    addAuthor(created.data.data[0]);
    form.setValue("author", id);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Updated values:", { id: book.id, ...values });
    setOpen(false);
  }

  const handleQuantityChange = async (delta: number) => {
    const currentQuantity = form.getValues("bookQuantity");
    const updateQuantity = Math.max(0, currentQuantity + delta)

    form.setValue("bookQuantity", updateQuantity);
  };

  const handleRetireBook = async () => {
    try {
      axiosInstance.put(`/api/v1/books/retired/${book.id}`)
    } catch (error) {
      console.error("Failed to retire book:", error);
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
      setOpen(false);
    } catch (error) {
      console.error("Failed to update inventory:", error);
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
                  <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)}>
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-16 text-center"
                      />
                    )}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
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
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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