import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import db from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // ดึงรายการ session ล่าสุด
        const [rows]: any = await db.execute(
            `SELECT s.id, s.title, s.created_at, 
            (SELECT content FROM chat_messages WHERE session_id = s.id ORDER BY created_at ASC LIMIT 1) as first_msg
            FROM chat_sessions s 
            WHERE s.client_id = ? 
            ORDER BY s.created_at DESC`,
            [userId]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch sessions error:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}
