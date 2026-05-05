export interface UserRow {
    id: number;
    email: string;
    password_hash: string;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
    updated_at?: string;
}
