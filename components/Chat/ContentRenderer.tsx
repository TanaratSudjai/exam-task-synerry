import React from 'react';
import { ContentRendererProps } from "@/types/chat/index";


export const ContentRenderer: React.FC<ContentRendererProps> = ({ content, sources }) => {
  if (!sources || sources.length === 0) return <>{content}</>;

  const parts = content.split(/(\[\d+\])/g);

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/\[(\d+)\]/);
        if (match) {
          const id = parseInt(match[1]);
          const exists = sources.some(s => s.id === id);
          if (exists) {
            return (
              <span
                key={index}
                className="inline-flex items-center justify-center w-4 h-4 mx-0.5 text-[9px] font-bold text-white bg-emerald-500 rounded-full shadow-sm align-top mt-0.5"
                title={`ดูที่มาลำดับที่ ${id}`}
              >
                {id}
              </span>
            );
          }
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};
