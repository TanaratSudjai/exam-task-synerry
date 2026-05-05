import { useState, useRef, useEffect } from "react";
import { Message, ChatForm } from "@/types/chat";
import { ChatService } from "@/service/Chat/chatService";

const initialForm: ChatForm = {
    message: "",
};

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [form, setForm] = useState<ChatForm>(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!form.message.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: form.message };
        setMessages((prev) => [...prev, userMessage]);
        setForm(initialForm);
        setIsLoading(true);

        try {
            const assistantMessage = await ChatService.sendMessage(userMessage.content);
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        form,
        setForm,
        isLoading,
        messagesEndRef,
        handleSend,
        handleChange,
    };
};
