"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useClickOutside } from '@/hook/useClickOutside';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}: ModalProps) {
    // ใช้ Hook ปิด Modal เมื่อคลิกนอกกล่องขาว
    const modalRef = useClickOutside<HTMLDivElement>(onClose);

    // ป้องกันการ Scroll พื้นหลังเมื่อ Modal เปิดอยู่
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] h-[95vh]'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 font-kanit">
            {/* Overlay - ฉากหลังดำโปร่งแสง */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={`
          relative w-full bg-white shadow-2xl rounded-2xl flex flex-col
          animate-in zoom-in-95 duration-200 overflow-hidden
          ${sizeClasses[size]}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">
                        {title || 'จัดการข้อมูล'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;