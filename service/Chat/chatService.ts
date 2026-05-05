import axios from "axios";
import { ChatSession, Message } from "@/types/chat";

export const ChatService = {
    sendMessage: async (message: string, sessionId: number | null = null): Promise<any> => {
        const response = await axios.post('/api/chat', { message, sessionId });
        return response.data;
    },
    getHistory: async (sessionId: number | null = null): Promise<Message[]> => {
        const response = await axios.get('/api/chat', { params: { sessionId } });
        return response.data;
    },
    getSessions: async (): Promise<ChatSession[]> => {
        const response = await axios.get('/api/chat/sessions');
        return response.data;
    },
    deleteSession: async (sessionId: number): Promise<any> => {
        const response = await axios.delete('/api/chat/sessions', { params: { sessionId } });
        return response.data;
    }
};
