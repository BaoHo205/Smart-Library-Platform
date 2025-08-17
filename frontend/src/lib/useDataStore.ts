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
    addPublisher: (pub: Publisher) => void;
    addAuthor: (auth: Author) => void;
    setPublishers: (list: Publisher[]) => void;
    setAuthors: (list: Author[]) => void;
    setGenres: (list: Genre[]) => void;
};

export const useDataStore = create<DataState>((set) => ({
    publisherList: [],
    authorList: [],
    genreList: [],

    addPublisher: (pub) =>
        set((state) => ({ publisherList: [...state.publisherList, pub] })),

    addAuthor: (auth) =>
        set((state) => ({ authorList: [...state.authorList, auth] })),

    setPublishers: (list) => set(() => ({ publisherList: list })),
    setAuthors: (list) => set(() => ({ authorList: list })),

    setGenres: (list) => set(() => ({ genreList: list }))
}));


