import { useState, useRef, useEffect } from "react";
import { Message, ChatForm, ChatSession } from "@/types/chat";
import { ChatService } from "@/service/Chat/chatService";

const initialForm: ChatForm = {
    message: "",
};

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
    const [form, setForm] = useState<ChatForm>(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // โหลดรายการ session ทั้งหมด
    const loadSessions = async () => {
        try {
            const data = await ChatService.getSessions();
            setSessions(data);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        }
    };

    // โหลดประวัติของ session ที่เลือก
    const loadHistory = async (sessionId: number | null) => {
        try {
            const history = await ChatService.getHistory(sessionId);
            setMessages(history);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        loadHistory(activeSessionId);
    }, [activeSessionId]);

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
        const currentMessage = form.message;
        setForm(initialForm);
        setIsLoading(true);

        try {
            const response = await ChatService.sendMessage(currentMessage, activeSessionId);
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: response.content,
                usage: response.usage
            }]);

            // ถ้าเป็นแชทใหม่ (เพิ่งได้ sessionId มา) ให้สลับไป session นั้น
            if (!activeSessionId && response.sessionId) {
                setActiveSessionId(response.sessionId);
                loadSessions();
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSession = async (sessionId: number) => {
        try {
            await ChatService.deleteSession(sessionId);
            await loadSessions();
            if (activeSessionId === sessionId) {
                handleNewChat();
            }
        } catch (error) {
            console.error("Failed to delete session", error);
            throw error;
        }
    };

    const handleNewChat = () => {
        setActiveSessionId(null);
        setMessages([]);
    };

    return {
        messages,
        sessions,
        activeSessionId,
        setActiveSessionId,
        form,
        setForm,
        isLoading,
        messagesEndRef,
        handleSend,
        handleChange,
        handleNewChat,
        handleDeleteSession,
        loadSessions
    };
};
