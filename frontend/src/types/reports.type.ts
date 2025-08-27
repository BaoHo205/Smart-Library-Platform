export interface StaffReportsFiltersState {
    startDate: string;
    endDate: string;
    monthsBack: number;
    interval: number;
    mostBorrowedLimit: number | 'max';
    topReadersLimit: number;
}

export interface MostBorrowedBook {
    bookId: string;
    title: string;
    authors: string;
    total_checkouts: number;
    availableCopies: number;
    quantity: number;
    coverUrl?: string | null;
}

export interface TopActiveReader {
    readerId: string;
    reader_name: string;
    total_checkouts: number;
    last_checkout_date: string;
}

// Staff Reports BookAvailability (keeps snake_case to match backend)
export interface BookAvailability {
    bookId: string;
    title: string;
    availableCopies: number;
    quantity: number;
    availability_percentage: number;
    recent_checkouts: number;
    coverUrl?: string | null;
}


