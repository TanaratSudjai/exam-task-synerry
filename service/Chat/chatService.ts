import axios from "axios";
import { Message } from "@/types/chat";

export const ChatService = {
    sendMessage: async (message: string): Promise<Message> => {
        const response = await axios.post('/api/chat', { message });
        return {
            role: "assistant",
            content: response.data.content,
            usage: response.data.usage,
        };
    }
};
