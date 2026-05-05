import axios from "axios";

export const ragService = {
    processFile: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/rag/process", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    chat: async (question: string, chunks: any[]) => {
        const response = await axios.post("/api/rag/chat", {
            question,
            chunks
        });
        return response.data;
    }
};
