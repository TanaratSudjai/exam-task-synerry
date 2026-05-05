import { groq, GROQ_CONFIG } from "@/lib/groq";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ChatRepository } from "@/lib/chat-db";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        const userId = (session.user as any).id;

        const rows = await ChatRepository.getMessages(userId, sessionId);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch history error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { message, sessionId: existingSessionId } = await req.json();

        let sessionId = existingSessionId;

        // 1. ถ้าไม่มี sessionId ให้สร้างใหม่
        if (!sessionId) {
            sessionId = await ChatRepository.createSession(userId, message);
        }

        // 2. ดึงประวัติของ session นี้มาเป็น Context
        const history = await ChatRepository.getRecentHistory(sessionId);

        const currentMessages = [
            ...history.map((h: any) => ({ role: h.role, content: h.content })),
            { role: "user", content: message }
        ];

        // 3. เรียก Groq
        const completion = await groq.chat.completions.create({
            messages: currentMessages,
            model: GROQ_CONFIG.model,
            temperature: GROQ_CONFIG.temperature,
        });

        const assistantContent = completion.choices[0]?.message?.content || "";
        const usage = completion.usage;

        // 4. บันทึกลง Database
        await ChatRepository.saveMessage(sessionId, 'user', message);
        await ChatRepository.saveMessage(sessionId, 'assistant', assistantContent, usage);

        return NextResponse.json({
            content: assistantContent,
            sessionId: sessionId,
            usage: usage,
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Failed to fetch Groq" }, { status: 500 });
    }
}
