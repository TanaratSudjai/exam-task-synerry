import { useState, useRef, useEffect } from "react";
import { RAGForm, RAGMessage } from "@/types/rag";
import { showToast } from "@/lib/toast";
import { ragService } from "@/service/RAG/ragService";

const initialForm: RAGForm = {
    question: "",
};

export const useRAG = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<RAGMessage[]>([]);
    const [chunks, setChunks] = useState<any[]>([]);
    const [form, setForm] = useState<RAGForm>(initialForm);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf" && selectedFile.type !== "text/plain") {
                showToast("รองรับเฉพาะไฟล์ PDF และ TXT เท่านั้น", "error");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setIsProcessing(true);

        try {
            const data = await ragService.processFile(file);
            setChunks(data.data);
            showToast(`วิเคราะห์เอกสารสำเร็จ! แบ่งเป็น ${data.totalChunks} ส่วน`, "success");
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || "เกิดข้อผิดพลาดในการประมวลผลเอกสาร", "error");
        } finally {
            setIsUploading(false);
            setIsProcessing(false);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!form.question.trim() || isLoading) return;

        if (chunks.length === 0) {
            showToast("กรุณาอัปโหลดและประมวลผลเอกสารก่อนถามคำถาม", "warning");
            return;
        }

        const userMsg: RAGMessage = { role: "user", content: form.question };
        setMessages(prev => [...prev, userMsg]);
        setForm(initialForm);
        setIsLoading(true);

        try {
            const data = await ragService.chat(userMsg.content, chunks);
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: data.content,
                usage: data.usage,
                sources: data.sources
            }]);
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || "เกิดข้อผิดพลาดในการดึงคำตอบ", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        file,
        setFile,
        isUploading,
        isProcessing,
        messages,
        form,
        isLoading,
        messagesEndRef,
        handleFileChange,
        handleUpload,
        handleSend,
        handleChange
    };
};
