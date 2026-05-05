import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ChatRepository } from "@/lib/chat-db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = (session.user as any).id;
        const rows = await ChatRepository.getSessions(userId);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch sessions error:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        const userId = (session.user as any).id;

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        await ChatRepository.deleteSession(Number(sessionId), userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete session error:", error);
        return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
    }
}
