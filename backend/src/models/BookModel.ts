export interface Book {
    id: string;
    title: string;
    thumbnail_url?: string | null; // Optional, can be null
    isbn?: string | null;         // Optional, can be null
    quantity?: number | null;     // Optional, can be null
    page_count?: number | null;   // Optional, can be null
    publisher_id?: string | null; // Optional, can be null (due to ON DELETE SET NULL)
    description?: string | null;  // Optional, can be null
    status?: 'available' | 'borrowed' | 'lost' | 'damaged' | 'maintenance'; // ENUM type
    created_at?: Date | string;   // DATETIME from DB, can be Date object or string
    updated_at?: Date | string;   // DATETIME from DB, can be Date object or string
}