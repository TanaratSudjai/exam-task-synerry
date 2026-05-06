import db from "./db";
import { UserRow } from "@/types/user";

export const UserRepository = {
    async findByEmail(email: string): Promise<UserRow | null> {
        const { rows } = await db.query(
            'SELECT * FROM clients WHERE email = $1',
            [email]
        );
        return (rows[0] as UserRow) || null;
    },

    async createUser(data: { email: string; passwordHash: string; first_name?: string; last_name?: string }): Promise<number> {
        const { rows } = await db.query(
            'INSERT INTO clients (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id',
            [data.email, data.passwordHash, data.first_name || null, data.last_name || null]
        );
        return rows[0].id;
    }
};
