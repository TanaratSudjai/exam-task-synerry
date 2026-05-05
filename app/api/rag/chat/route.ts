import { NextResponse } from "next/server";
import { groq, GROQ_CONFIG } from "@/lib/groq";
import { getEmbedding, cosineSimilarity } from "@/lib/rag/embeddings";

export async function POST(req: Request) {
    try {
        const { question, chunks } = await req.json();

        if (!question || !chunks || chunks.length === 0) {
            return NextResponse.json({ error: "กรุณาระบุคำถามและข้อมูลเอกสาร" }, { status: 400 });
        }

        // 1. สร้าง Embedding สำหรับคำถาม
        const questionEmbedding = await getEmbedding(question);

        // 2. ค้นหา Chunks ที่เกี่ยวข้องที่สุด (Similarity Search)
        const scoredChunks = chunks.map((chunk: any) => ({
            ...chunk,
            score: cosineSimilarity(questionEmbedding, chunk.embedding)
        }));

        // เรียงลำดับตามคะแนนความคล้ายคลึง และเลือกมาเฉพาะ 3 อันดับแรก
        const relevantChunks = scoredChunks
            .sort((a: any, b: any) => b.score - a.score)
            .slice(0, 3);

        const context = relevantChunks.map((c: any) => c.content).join("\n\n---\n\n");

        // 3. ส่ง Context + Question ให้ Groq สรุปคำตอบ
        const prompt = `
            ใช้ข้อมูลจากเอกสารที่กำหนดให้ด้านล่างนี้เพื่อตอบคำถามของผู้ใช้ 
            หากในเอกสารไม่มีข้อมูลที่เกี่ยวข้อง ให้บอกว่า "ขออภัย ไม่พบข้อมูลที่เกี่ยวข้องในเอกสารนี้"
            
            [ข้อมูลเอกสาร]:
            ${context}
            
            [คำถาม]:
            ${question}
            
            ตอบคำตอบอย่างเป็นกันเองและถูกต้องตามเนื้อหาในเอกสาร:
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: GROQ_CONFIG.model,
            temperature: 0.5,
        });

        return NextResponse.json({
            content: completion.choices[0]?.message?.content,
            usage: completion.usage,
            relevantContext: relevantChunks.map((c: any) => ({ content: c.content, score: c.score }))
        });

    } catch (error: any) {
        console.error("RAG Chat Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงคำตอบ: " + error.message }, { status: 500 });
    }
}
