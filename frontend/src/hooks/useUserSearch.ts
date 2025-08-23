import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import api from '@/api/api';

export interface UserSearchResult {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
}

export function useUserSearch(searchTerm: string) {
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

    useEffect(() => {
        const searchUsers = async () => {
            if (debouncedSearchTerm.length < 1) {
                // Load all users alphabetically when no search term
                setLoading(true);
                try {
                    const response = await api.getAllUsers();
                    setUsers(response);
                    setError(null);
                } catch (err) {
                    setError('Failed to load users');
                    setUsers([]);
                } finally {
                    setLoading(false);
                }
                return;
            }

            if (debouncedSearchTerm.length >= 1) {
                setLoading(true);
                try {
                    const response = await api.searchUsers(debouncedSearchTerm);
                    setUsers(response);
                    setError(null);
                } catch (err) {
                    setError('Failed to search users');
                    setUsers([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        searchUsers();
    }, [debouncedSearchTerm]);

    return { users, loading, error };
}
