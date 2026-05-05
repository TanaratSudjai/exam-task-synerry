"use client";

import React, { ChangeEvent } from "react";

type BaseFileUploadProps = {
    id: string;
    name?: string;
    label?: string;
    accept?: string;
    preview?: string;
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
    placeholder = "เลือกรูปภาพ",
    className = "",
    disabled = false,
    onFileChange,
}: BaseFileUploadProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileChange(file);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <h1 className="block text-sm font-medium text-slate-900">
                    {label}
                </h1>
            )}

            <label
                htmlFor={id}
                className={`flex items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden transition-colors ${disabled
                        ? "bg-slate-100 cursor-not-allowed"
                        : "bg-slate-50 hover:bg-slate-100 cursor-pointer"
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

                {preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-slate-400 font-medium">{placeholder}</span>
                    </div>
                )}
            </label>
        </div>
    );
}