import { groq, GROQ_CONFIG } from "@/lib/groq";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        const userId = (session.user as any).id;
        let query = 'SELECT role, content FROM chat_messages m JOIN chat_sessions s ON m.session_id = s.id WHERE s.client_id = ?';
        let params: any[] = [userId];
        if (sessionId) {
            query += ' AND m.session_id = ?';
            params.push(sessionId);
        }

        const [rows]: any = await db.execute(query + ' ORDER BY m.created_at ASC', params);
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

        // 1. ถ้าไม่มี sessionId ให้สร้างใหม่ในตาราง chat_sessions
        if (!sessionId) {
            const [result]: any = await db.execute(
                'INSERT INTO chat_sessions (client_id, title) VALUES (?, ?)',
                [userId, message.substring(0, 50)]
            );
            sessionId = result.insertId;
        }

        // 2. ดึงประวัติของ session นี้
        const [history]: any = await db.execute(
            'SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 10',
            [sessionId]
        );

        const historyMessages = history.reverse().map((h: any) => ({
            role: h.role,
            content: h.content
        }));

        const currentMessages = [
            ...historyMessages,
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

        // 4. บันทึกลง Database (chat_messages)
        // บันทึกข้อความของ user
        await db.execute(
            'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
            [sessionId, 'user', message]
        );

        // บันทึกข้อความของ assistant พร้อม token usage
        await db.execute(
            'INSERT INTO chat_messages (session_id, role, content, prompt_tokens, completion_tokens, total_tokens, total_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                sessionId,
                'assistant',
                assistantContent,
                usage?.prompt_tokens || 0,
                usage?.completion_tokens || 0,
                usage?.total_tokens || 0,
                (usage as any)?.total_time || 0
            ]
        );

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
