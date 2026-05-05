import React from 'react';
import BaseBadge from "@/components/Base/Badge";
import { Message } from "@/types/chat";

const ChatBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-md transition-all ${isUser
          ? "bg-emerald-500 text-white rounded-br-none"
          : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
          }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
      </div>

      {!isUser && msg.usage && (
        <div className="flex flex-wrap gap-2 mt-2 px-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex gap-3">
            <span>TOKENS: {msg.usage.total_tokens}</span>
            <span>TIME: {msg.usage.total_time.toFixed(3)}s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
// (P: {msg.usage.prompt_tokens}, C: {msg.usage.completion_tokens})