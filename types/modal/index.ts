import React from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}


export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description: string;
    type?: 'danger' | 'warning' | 'success' | 'info'| 'emerald';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    shape?: 'rounded' | 'full' | 'square'
    btnSize?: 'lg' | 'md' | 'sm'
}