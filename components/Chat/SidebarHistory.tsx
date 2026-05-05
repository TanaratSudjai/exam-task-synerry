import React from "react";
import { ChatSession } from "@/types/chat";
import { MessageSquare, Plus } from "lucide-react";
import BaseButton from "../Base/Button";

interface SidebarHistoryProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (id: string | null) => void;
    onNewChat: () => void;
}

export default function SidebarHistory({ 
    sessions, 
    activeSessionId, 
    onSelectSession, 
    onNewChat 
}: SidebarHistoryProps) {
    return (
        <div className="w-64 border-r border-slate-100 flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-100">
                <BaseButton 
                    variant="primary" 
                    className="w-full justify-start gap-2" 
                    onClick={onNewChat}
                    leftIcon={<Plus size={18} />}
                >
                    แชทใหม่
                </BaseButton>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.length === 0 ? (
                    <div className="text-center p-4 text-slate-400 text-sm">
                        ไม่มีประวัติแชท
                    </div>
                ) : (
                    sessions.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => onSelectSession(session.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group flex items-start gap-3 ${
                                activeSessionId === session.id 
                                ? "bg-blue-50 text-blue-600" 
                                : "hover:bg-slate-50 text-slate-600"
                            }`}
                        >
                            <MessageSquare size={18} className={`mt-0.5 shrink-0 ${
                                activeSessionId === session.id ? "text-blue-500" : "text-slate-400"
                            }`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {session.title || "ไม่มีชื่อหัวข้อ"}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {new Date(session.created_at).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
