// components/AddNewBookDialog.tsx
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"; // Adjust this import path as needed
import { Plus, Minus } from "lucide-react";
import { ComboboxWithCreate } from "./ComboboxWithCreate";

export interface Publisher {
    id?: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Author {
    id?: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

const formSchema = z.object({
    bookTitle: z.string().min(2, { message: "Book title must be at least 2 characters." }),
    isbn: z.string().optional(),
    publisher: z.string().min(1, { message: "Publisher is required." }),
    author: z.string().min(1, { message: "Author is required." }),
    thumbnailLink: z.string().url({ message: "Invalid URL." }).optional(),
    bookQuantity: z.number().min(0, { message: "Quantity cannot be negative." }),
    description: z.string().optional(),
});

export function AddNewBookDialog() {
    const [open, setOpen] = useState(false);
    const [publisherList, setPublisherList] = useState<Publisher[]>([]);
    const [authorList, setAuthorList] = useState<Author[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookTitle: "",
            isbn: "",
            publisher: "",
            author: "",
            thumbnailLink: "",
            bookQuantity: 0,
            description: "",
        },
    });

    useEffect(() => {
        if (open) {
            // Simulate fetching data from backend
            setPublisherList([{ id: "pub1", name: "FTECH", createdAt: new Date(), updatedAt: new Date() }]);
            setAuthorList([{ id: "auth1", firstName: "Robert", lastName: "Ludke", createdAt: new Date(), updatedAt: new Date() }]);
        }
    }, [open]);

    const handleNewPublisher = async (name: string) => {
        console.log("Creating new publisher:", name);
        // 1. Simulate API call and get the new publisher object
        const newPublisherId = `pub${Date.now()}`;
        const newPublisher = { id: newPublisherId, name: name, createdAt: new Date(), updatedAt: new Date() };

        // 2. Update the state with the new publisher
        setPublisherList([...publisherList, newPublisher]);

        // 3. Set the form value to the new publisher's ID
        form.setValue("publisher", newPublisher.id as string);
    };

    const handleNewAuthor = async (fullName: string) => {
        console.log("Creating new author:", fullName);
        const [firstName, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        // 1. Simulate API call and get the new author object
        const newAuthorId = `auth${Date.now()}`;
        const newAuthor = { id: newAuthorId, firstName: firstName, lastName: lastName, createdAt: new Date(), updatedAt: new Date() };

        // 2. Update the state with the new author
        setAuthorList([...authorList, newAuthor]);

        // 3. Set the form value to the new author's ID
        form.setValue("author", newAuthor.id as string);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setOpen(false);
    }

    const handleQuantityChange = (delta: number) => {
        const currentQuantity = form.getValues("bookQuantity");
        form.setValue("bookQuantity", Math.max(0, currentQuantity + delta));
    };

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
            <Button onClick={() => setOpen(true)}>Add New Book</Button>
            <DialogContent className="sm:max-w-xl">
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
                        <div className="grid grid-cols-2 gap-4">
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
                                                onNewItem={handleNewPublisher}
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
                                                onNewItem={handleNewAuthor}
                                                placeholder="Select or add author..."
                                                searchPlaceholder="Search author..."
                                                emptyMessage="No author found."
                                                label="Author"
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
                                        <Textarea placeholder="Enter book description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Add new Book</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}