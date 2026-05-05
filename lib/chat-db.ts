import db from "./db";
import { ChatSessionRow, ChatMessageRow } from "@/types/chat";

export const ChatRepository = {
    async getSessions(userId: number): Promise<ChatSessionRow[]> {
        const [rows]: any = await db.execute(
            `SELECT s.id, s.title, s.created_at, 
            (SELECT content FROM chat_messages WHERE session_id = s.id ORDER BY created_at ASC LIMIT 1) as first_msg
            FROM chat_sessions s 
            WHERE s.client_id = ? 
            ORDER BY s.created_at DESC`,
            [userId]
        );
        return rows as ChatSessionRow[];
    },

    async getMessages(userId: number, sessionId?: string | null): Promise<ChatMessageRow[]> {
        let query = 'SELECT role, content FROM chat_messages m JOIN chat_sessions s ON m.session_id = s.id WHERE s.client_id = ?';
        let params: any[] = [userId];

        if (sessionId) {
            query += ' AND m.session_id = ?';
            params.push(sessionId);
        }

        const [rows]: any = await db.execute(query + ' ORDER BY m.created_at ASC', params);
        return rows as ChatMessageRow[];
    },

    async createSession(userId: number, title: string): Promise<number> {
        const [result]: any = await db.execute(
            'INSERT INTO chat_sessions (client_id, title) VALUES (?, ?)',
            [userId, title.substring(0, 50)]
        );
        return result.insertId;
    },

    async getRecentHistory(sessionId: number, limit: number = 10): Promise<ChatMessageRow[]> {
        const [history]: any = await db.execute(
            'SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY created_at DESC LIMIT ?',
            [sessionId, limit]
        );
        return history.reverse() as ChatMessageRow[];
    },

    async saveMessage(sessionId: number, role: string, content: string, usage?: any) {
        if (role === 'assistant' && usage) {
            await db.execute(
                'INSERT INTO chat_messages (session_id, role, content, prompt_tokens, completion_tokens, total_tokens, total_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
            await db.execute(
                'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
                [sessionId, role, content]
            );
        }
    },

    async deleteSession(sessionId: number, userId: number) {
        await db.execute(
            'DELETE FROM chat_sessions WHERE id = ? AND client_id = ?',
            [sessionId, userId]
        );
    }
};
