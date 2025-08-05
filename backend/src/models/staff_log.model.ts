export interface StaffLog {
    id: string;
    staff_id: string;
    action_type: 'checkout' | 'return' | 'add_book' | 'delete_book' | 'user_management' | 'system_maintenance' | 'other';
    action_details: string; // Text field for detailed description
    created_at?: Date | string;
    updated_at?: Date | string;
}