import { NextResponse } from "next/server";
import { extractTextFromBuffer, chunkText } from "@/lib/rag/processor";
import { getEmbedding } from "@/lib/rag/embeddings";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await extractTextFromBuffer(buffer, file.type);
        const chunks = chunkText(text);

        const chunksWithEmbeddings = [];

        for (const chunk of chunks) {
            const embedding = await getEmbedding(chunk);
            chunksWithEmbeddings.push({
                content: chunk,
                embedding: embedding
            });
        }

        return NextResponse.json({
            fileName: file.name,
            totalChunks: chunks.length,
            data: chunksWithEmbeddings
        });
    } catch (error: any) {
        console.error("RAG Processing Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการประมวลผลไฟล์: " + error.message }, { status: 500 });
    }
}
