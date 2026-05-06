import { NextResponse } from "next/server";
import { ragChatService } from "@/service/RAG/ragBackendService";
import { Chunk } from "@/types/rag";

export async function POST(req: Request) {
    try {
        const { question, chunks }: { question: string; chunks: Chunk[] } = await req.json();

        if (!question || !chunks || chunks.length === 0) {
            return NextResponse.json({ error: "กรุณาระบุคำถามและข้อมูลเอกสาร" }, { status: 400 });
        }

        // 1. ค้นหา Chunks ที่เกี่ยวข้อง
        const relevantChunks = await ragChatService.findRelevantChunks(question, chunks);

        // 2. ส่งให้ LLM ประมวลผลคำตอบ
        const result = await ragChatService.generateResponse(question, relevantChunks);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("RAG Chat Error:", error);
        return NextResponse.json({
            error: "เกิดข้อผิดพลาดในการประมวลผล: " + (error.message || "Unknown error")
        }, { status: 500 });
    }
}
