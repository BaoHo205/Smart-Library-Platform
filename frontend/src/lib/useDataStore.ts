import { BookShow } from "@/app/admin/columns";
import { create } from "zustand";

export interface Publisher {
    id: string;
    name: string;
}

export interface Author {
    id: string;
    firstName: string;
    lastName: string;
}

export interface Genre {
    id?: string;
    name: string;
}

type DataState = {
    publisherList: Publisher[];
    authorList: Author[];
    genreList: Genre[];
    books: BookShow[];
    addPublisher: (pub: Publisher) => void;
    addAuthor: (auth: Author) => void;
    addBook: (book: BookShow) => void;
    setPublishers: (list: Publisher[]) => void;
    setAuthors: (list: Author[]) => void;
    setGenres: (list: Genre[]) => void;
    setBooks: (list: BookShow[]) => void;
    retireBook: (bookId: string) => void;
    updateQuantity: (bookId: string, newQuantity: number) => void;
};

export const useDataStore = create<DataState>((set) => ({
    publisherList: [],
    authorList: [],
    genreList: [],
    books: [],

    addPublisher: (pub) =>
        set((state) => ({ publisherList: [...state.publisherList, pub] })),

    addAuthor: (auth) =>
        set((state) => ({ authorList: [...state.authorList, auth] })),

    addBook: (book) =>
        set((state) => ({ books: [...state.books, book] })),

    setPublishers: (list) => set(() => ({ publisherList: list })),
    setAuthors: (list) => set(() => ({ authorList: list })),
    setGenres: (list) => set(() => ({ genreList: list })),
    setBooks: (list) => set(() => ({ books: list })),

    retireBook: (bookId) =>
        set((state) => ({
            books: state.books.map((book) =>
                // Find the book with the matching ID
                book.id === bookId
                    ? // If found, return a new object with the `isRetired` property updated
                    { ...book, status: "unavailable" }
                    : // Otherwise, return the book unchanged
                    book
            ),
        })),

    updateQuantity: (bookId, newQuantity) =>
        set((state) => ({
            books: state.books.map((book) =>
                // Find the book with the matching ID
                book.id === bookId
                    ? // If found, return a new object with the `isRetired` property updated
                    { ...book, quantity: newQuantity }
                    : // Otherwise, return the book unchanged
                    book
            ),
        })),
}));


