import React from 'react';
import BaseBadge from "@/components/Base/Badge";
import { Message } from "@/types/chat";

const ChatBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${isUser
          ? "bg-emerald-600 text-white rounded-br-none"
          : "bg-slate-100 text-slate-800 rounded-bl-none"
          }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
      </div>

      {!isUser && msg.usage && (
        <div className="flex flex-wrap gap-2 mt-2 ml-1">
          <BaseBadge variant="info">
            Tokens: {msg.usage.total_tokens}
          </BaseBadge>
          <BaseBadge variant="success">
            Time: {msg.usage.total_time.toFixed(3)}s
          </BaseBadge>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
// (P: {msg.usage.prompt_tokens}, C: {msg.usage.completion_tokens})