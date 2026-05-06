import React from 'react';
import { BookOpen } from 'lucide-react';
import { Message, Source } from "@/types/chat";
import { ContentRenderer } from "./ContentRenderer";
import { cleanThaiText } from "@/utils";

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
        <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
          <ContentRenderer content={msg.content} sources={msg.sources} />
        </div>

        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <BookOpen size={12} className="text-emerald-500" />
              รายการอ้างอิงจากเอกสาร
            </div>
            <div className="space-y-2">
              {msg.sources.map((source: Source) => {
                return (
                  <div
                    key={source.id}
                    id={`source-${msg.role}-${source.id}`}
                    className="text-[13px] bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 leading-[1.6] relative overflow-hidden group transition-all duration-500"
                    style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                    <span className="font-bold text-emerald-600 mr-1.5">[{source.id}]</span>
                    {cleanThaiText(source.content)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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