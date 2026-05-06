import db from "./db";
import { ChatSessionRow, ChatMessageRow } from "@/types/chat";

export const ChatRepository = {
    async getSessions(userId: number): Promise<ChatSessionRow[]> {
        const { rows } = await db.query(
            `SELECT s.id, s.title, s.created_at, 
            (SELECT content FROM chat_messages WHERE session_id = s.id ORDER BY created_at ASC LIMIT 1) as first_msg
            FROM chat_sessions s 
            WHERE s.client_id = $1 
            ORDER BY s.created_at DESC`,
            [userId]
        );
        return rows as ChatSessionRow[];
    },

    async getMessages(userId: number, sessionId?: string | null): Promise<ChatMessageRow[]> {
        let query = 'SELECT role, content FROM chat_messages m JOIN chat_sessions s ON m.session_id = s.id WHERE s.client_id = $1';
        let params: any[] = [userId];

        if (sessionId) {
            query += ' AND m.session_id = $2';
            params.push(sessionId);
        }

        const { rows } = await db.query(query + ' ORDER BY m.created_at ASC', params);
        return rows as ChatMessageRow[];
    },

    async createSession(userId: number, title: string): Promise<number> {
        const { rows } = await db.query(
            'INSERT INTO chat_sessions (client_id, title) VALUES ($1, $2) RETURNING id',
            [userId, title.substring(0, 50)]
        );
        return rows[0].id;
    },

    async getRecentHistory(sessionId: number, limit: number = 10): Promise<ChatMessageRow[]> {
        const { rows } = await db.query(
            'SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at DESC LIMIT $2',
            [sessionId, limit]
        );
        return rows.reverse() as ChatMessageRow[];
    },

    async saveMessage(sessionId: number, role: string, content: string, usage?: any) {
        if (role === 'assistant' && usage) {
            await db.query(
                'INSERT INTO chat_messages (session_id, role, content, prompt_tokens, completion_tokens, total_tokens, total_time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [
                    sessionId,
                    role,
                    content,
                    usage.prompt_tokens || 0,
                    usage.completion_tokens || 0,
                    usage.total_tokens || 0,
                    usage.total_time || 0
                ]
            );
        } else {
            await db.query(
                'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
                [sessionId, role, content]
            );
        }
    },

    async deleteSession(sessionId: number, userId: number) {
        await db.query(
            'DELETE FROM chat_sessions WHERE id = $1 AND client_id = $2',
            [sessionId, userId]
        );
    }
};
