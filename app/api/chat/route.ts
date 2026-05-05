import { groq, GROQ_CONFIG } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: GROQ_CONFIG.model,
            temperature: GROQ_CONFIG.temperature,
        });

        return NextResponse.json({
            content: completion.choices[0]?.message?.content,
            usage: completion.usage, // ข้อมูล token usage (Requirement ข้อ 4)
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Groq" }, { status: 500 });
    }
}
