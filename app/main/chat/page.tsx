"use client";

import React from "react";
import BaseInput from "@/components/Base/Input";
import BaseButton from "@/components/Base/Button";
import BaseCard from "@/components/Base/Card";
import { Send } from "lucide-react";
import { useChat } from "@/hook/useChat";
import ChatBubble from "@/components/Chat/ChatBubble";
import EmptyState from "@/components/Chat/EmptyState";
import LoadingBubble from "@/components/Chat/LoadingBubble";
import SidebarHistory from "@/components/Chat/SidebarHistory";
import BaseItemForm from "@/components/Base/ItemForm";

export default function ChatPage() {
  const { 
    messages, 
    sessions, 
    activeSessionId, 
    setActiveSessionId, 
    form, 
    isLoading, 
    messagesEndRef, 
    handleSend, 
    handleChange,
    handleNewChat 
  } = useChat();

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 p-4">
      {/* ประวัติแชทด้านซ้าย */}
      <SidebarHistory 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
      />

      {/* พื้นที่แชทหลัก */}
      <BaseCard className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && <EmptyState />}
          {messages.map((msg, index) => (
            <ChatBubble key={index} msg={msg} />
          ))}
          {isLoading && <LoadingBubble />}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-slate-100 pt-4 mt-2">
          <BaseItemForm onSubmit={handleSend} className="flex gap-3 items-start">
            <BaseInput
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="พิมพ์ข้อความของคุณที่นี่..."
              containerClassName="flex-1"
              className="h-11"
              disabled={isLoading}
            />
            <BaseButton
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="h-11 px-6"
              rightIcon={!isLoading ? <Send size={18} /> : undefined}
            >
              ส่ง
            </BaseButton>
          </BaseItemForm>
        </div>
      </BaseCard>
    </div>
  );
}