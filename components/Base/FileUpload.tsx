"use client";

import React, { ChangeEvent } from "react";
import { FileText, Upload } from "lucide-react";
import Image from "next/image";

type BaseFileUploadProps = {
    id: string;
    name?: string;
    label?: string;
    accept?: string;
    preview?: string;
    fileName?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    onFileChange: (file: File) => void;
};

export default function BaseFileUpload({
    id,
    name,
    label,
    accept = "image/*",
    preview,
    fileName,
    placeholder = "เลือกไฟล์",
    className = "",
    disabled = false,
    onFileChange,
}: BaseFileUploadProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileChange(file);
    };

    const isImage = accept.includes("image");

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-900 mb-1">
                    {label}
                </label>
            )}

            <label
                htmlFor={id}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200 ${
                    disabled
                        ? "border-slate-200 cursor-not-allowed opacity-60"
                        : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer"
                }`}
            >
                <input
                    id={id}
                    name={name}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                    disabled={disabled}
                />

                {preview && isImage ? (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                    />
                ) : fileName ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-white p-3 rounded-xl  mb-3">
                            {/* <FileText size={24} /> */}
                             <Image
                                src="/give.png"
                                alt="Upload"
                                width={80}
                                height={80}
                            />  
                        </div>
                        <span className="text-sm font-semibold text-emerald-700 truncate max-w-[200px]">
                            {fileName}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">คลิกเพื่อเปลี่ยนไฟล์</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-slate-400 p-3 rounded-xl mb-3">
                            {/* <Upload size={24} /> */}

                            <Image
                                src="/text-pdf.png"
                                alt="Upload"
                                width={80}
                                height={80}
                            />  
                        </div>
                        <span className="text-sm font-medium text-slate-500">{placeholder}</span>
                        <span className="text-xs text-slate-400 mt-1">{accept.replace(/\./g, '').toUpperCase()} เท่านั้น</span>
                    </div>
                )}
            </label>
        </div>
    );
}