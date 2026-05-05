"use client";

import React from "react";
import Modal from "@/components/Base/Modal";
import Button from "@/components/Base/Button";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { ConfirmModalProps } from "@/types/modal";

function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "ยืนยันการทำรายการ",
    description,
    type = "warning",
    confirmText = "ยืนยัน",
    cancelText = "ยกเลิก",
    isLoading = false,
    shape = "full",
    btnSize = "sm",
}: ConfirmModalProps) {
    type ButtonVariant = "primary" | "danger" | 'emerald';

    const config: Record<
        NonNullable<ConfirmModalProps["type"]>,
        { icon: React.ReactNode; btn: ButtonVariant }
    > = {
        danger: {
            icon: <AlertTriangle className="text-red-500" size={40} />,
            btn: "danger",
        },
        warning: {
            icon: <AlertTriangle className="text-amber-500" size={40} />,
            btn: "primary",
        },
        success: {
            icon: <CheckCircle2 className="text-emerald-500" size={40} />,
            btn: "primary",
        },
        info: {
            icon: <Info className="text-blue-500" size={40} />,
            btn: "primary",
        },
        emerald: {
            icon: <CheckCircle2 className="text-emerald-500" size={40} />,
            btn: "emerald",
        }
    };

    const currentConfig = config[type];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={btnSize}
            footer={
                <div className="flex w-full gap-3">
                    <Button
                        shape={shape}
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        shape={shape}
                        variant={currentConfig.btn}
                        fullWidth
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center py-4 text-center font-kanit">
                <div className="mb-4 rounded-full bg-slate-50 p-3">
                    {currentConfig.icon}
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-800">
                    {title}
                </h3>

                {description && (
                    <p className="text-sm leading-relaxed text-slate-500">
                        {description}
                    </p>
                )}
            </div>
        </Modal>
    );
}

export default ConfirmModal;