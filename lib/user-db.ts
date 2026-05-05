import db from "./db";
import { UserRow } from "@/types/user";

export const UserRepository = {
    async findByEmail(email: string): Promise<UserRow | null> {
        const [rows]: any = await db.execute(
            'SELECT * FROM clients WHERE email = ?',
            [email]
        );
        return (rows[0] as UserRow) || null;
    },

    async createUser(data: { email: string; passwordHash: string; first_name?: string; last_name?: string }): Promise<number> {
        const [result]: any = await db.execute(
            'INSERT INTO clients (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
            [data.email, data.passwordHash, data.first_name || null, data.last_name || null]
        );
        return result.insertId;
    }
};
