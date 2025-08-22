import * as z from "zod";

const formSchema = z.object({
    bookTitle: z.string().min(2, {
        message: "Book title must be at least 2 characters.",
    }),
    isbn: z.string().optional(),
    publisher: z.string().min(2, {
        message: "Publisher must be at least 2 characters.",
    }),
    author: z.string().min(2, {
        message: "Author must be at least 2 characters.",
    }),
    thumbnailLink: z.string().url({
        message: "Invalid URL.",
    }).optional(),
    bookQuantity: z.number().min(0, {
        message: "Quantity cannot be negative.",
    }),
    description: z.string().optional(),
});