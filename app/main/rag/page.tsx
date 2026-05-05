"use client";

import React from "react";
import BaseCard from "@/components/Base/Card";
import BaseButton from "@/components/Base/Button";
import BaseInput from "@/components/Base/Input";
import BaseItemForm from "@/components/Base/ItemForm";
import BaseFileUpload from "@/components/Base/FileUpload";
import { Send, X, Loader2, MessageSquare, Sparkles } from "lucide-react";
import ChatBubble from "@/components/Chat/ChatBubble";
import LoadingBubble from "@/components/Chat/LoadingBubble";
import EmptyState from "@/components/Chat/EmptyState";
import { useRAG } from "@/hook/useRAG";
import BaseSpinner from "@/components/Base/Spinner";

export default function RAGPage() {
  const {
    file,
    setFile,
    isUploading,
    isProcessing,
    messages,
    form,
    isLoading,
    messagesEndRef,
    handleFileChange,
    handleUpload,
    handleSend,
    handleChange
  } = useRAG();

  return (
    <div className="space-y-6 pb-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
        <div className="lg:col-span-4 space-y-4 flex flex-col h-full">
          <BaseCard className="p-6 h-fit border-none shadow-sm flex flex-col gap-6">
            <BaseFileUpload
              id="rag-upload"
              label="เลือกเอกสารของคุณ"
              accept=".pdf,.txt"
              fileName={file?.name}
              placeholder="ลากไฟล์มาวางหรือคลิกเพื่อเลือก"
              onFileChange={(newFile) => {
                const mockEvent = {
                  target: { files: [newFile] }
                } as any;
                handleFileChange(mockEvent);
              }}
              disabled={isUploading || isProcessing}
            />
            {file && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                    <MessageSquare size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-600 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-rose-100 text-rose-500 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <BaseButton
              fullWidth
              variant="primary"
              className="h-12 shadow-md shadow-emerald-100"
              disabled={!file || isUploading || isProcessing}
              isLoading={isUploading || isProcessing}
              onClick={handleUpload}
            >
              {isProcessing ? "กำลังวิเคราะห์ข้อมูล..." : "เริ่มประมวลผล"}
            </BaseButton>
          </BaseCard>
        </div>

        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
          <BaseCard className="flex-1 flex flex-col overflow-hidden border-none shadow-sm bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/20">
              {messages.length === 0 && <EmptyState />}
              {messages.map((msg, index) => (
                <ChatBubble key={index} msg={msg} />
              ))}
              {isProcessing && (
                <BaseSpinner
                  show={true}
                  fullScreen={true}
                  activeColor="emerald"
                  text="กำลังประมวลผลเอกสาร..."
                  description="กรุณารอสักครู่"
                />
              )}
              {isLoading && (
                <div className="py-10">
                  <BaseSpinner
                    show={true}
                    fullScreen={false}
                    activeColor="emerald"
                    text="กำลังดึงคำตอบจาก AI..."
                    description="กรุณารอสักครู่"
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <BaseItemForm onSubmit={handleSend} className="flex gap-3">
                <BaseInput
                  name="question"
                  placeholder={file ? "ถามอะไรจากเอกสารนี้ดี..." : "อัปโหลดเอกสารก่อนเริ่มถาม..."}
                  value={form.question}
                  onChange={handleChange}
                  containerClassName="flex-1"
                  className="h-12 border-slate-200 focus:bg-white bg-slate-50/50"
                  disabled={isLoading || isProcessing || !file}
                />
                <BaseButton
                  type="submit"
                  variant="primary"
                  className="h-12 px-6 shadow-md shadow-emerald-100"
                  disabled={isLoading || isProcessing || !form.question.trim()}
                  rightIcon={!isLoading && <Send size={18} />}
                >
                  ถาม
                </BaseButton>
              </BaseItemForm>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  );
}
