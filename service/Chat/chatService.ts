import axios from "axios";
import { Message } from "@/types/chat";

export const ChatService = {
    sendMessage: async (message: string, sessionId: string | null = null): Promise<any> => {
        const response = await axios.post('/api/chat', { message, sessionId });
        return response.data;
    },
    getHistory: async (sessionId: string | null = null): Promise<Message[]> => {
        const response = await axios.get('/api/chat', { params: { sessionId } });
        return response.data;
    },
    getSessions: async (): Promise<ChatSession[]> => {
        const response = await axios.get('/api/chat/sessions');
        return response.data;
    }
};
