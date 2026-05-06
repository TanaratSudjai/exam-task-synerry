import { groq, GROQ_CONFIG } from "@/lib/groq";
import { getEmbedding, cosineSimilarity } from "@/lib/rag/embeddings";
import { Chunk, ScoredChunk } from "@/types/rag";

export const ragChatService = {
    // * ค้นหา Chunks ที่เกี่ยวข้องที่สุดด้วย Similarity Search
    findRelevantChunks: async (question: string, chunks: Chunk[], topK: number = 5): Promise<ScoredChunk[]> => {
        const questionEmbedding = await getEmbedding(question);
        return chunks
            .map((chunk) => ({
                ...chunk,
                score: cosineSimilarity(questionEmbedding, chunk.embedding)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    },

    //  * ส่งคำถามและ Context ให้ LLM สรุปคำตอบ
    generateResponse: async (question: string, relevantChunks: ScoredChunk[]) => {
        const contextText = relevantChunks.map((c, i) => `[${i + 1}] ${c.content}`).join("\n\n");

        const systemPrompt = `คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์เอกสาร (Thai RAG Specialist) 
                                    หน้าที่ของคุณคือตอบคำถามจาก <context> ที่กำหนดให้เท่านั้น

                                    กฎเหล็ก:
                                    1. หากไม่พบคำตอบใน <context> ให้ตอบว่า "ไม่พบข้อมูลที่เกี่ยวข้องในเอกสาร"
                                    2. ใช้เลขอ้างอิงในคำตอบเสมอ เช่น [1], [2]
                                    3. ข้อมูลอาจมีสระลอยหรือเว้นวรรคผิด ให้คุณ "ซ่อมแซมและเรียบเรียงใหม่" ให้เป็นภาษาไทยที่ถูกต้องและอ่านง่ายที่สุด
                                    4. ตอบกลับในรูปแบบ JSON ตามโครงสร้างที่ระบุไว้เท่านั้น`;

        const userPrompt = `
                                    <context>
                                    ${contextText}
                                    </context>

                                    <question>
                                    ${question}
                                    </question>

                                    <json_structure>
                                    {
                                        "answer": "คำตอบภาษาไทยที่เรียบเรียงแล้วพร้อมการอ้างอิง [n]",
                                        "sources": [
                                            { "id": 1, "content": "เนื้อหาอ้างอิงหมายเลข [1] ที่ซ่อมแซมสระลอยและเว้นวรรคแล้ว" }
                                        ]
                                    }
                                    </json_structure>`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: GROQ_CONFIG.model,
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const rawResponse = completion.choices[0]?.message?.content || "{}";
        let responseData;

        try {
            responseData = JSON.parse(rawResponse);
        } catch (e) {
            console.error("JSON Parse Error:", rawResponse);
            responseData = { answer: rawResponse, sources: [] };
        }

        return {
            content: responseData.answer || "ไม่สามารถสรุปคำตอบจากเอกสารได้",
            usage: completion.usage,
            sources: (responseData.sources && responseData.sources.length > 0)
                ? responseData.sources
                : relevantChunks.map((c, i) => ({
                    id: i + 1,
                    content: c.content,
                    score: c.score
                }))
        };
    }
};
