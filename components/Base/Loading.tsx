import { Inbox } from 'lucide-react';

interface BaseLoadingProps {
    type?: 'spinner' | 'table' | 'card' | 'empty';
    rows?: number;
    text?: string;
}

const BaseLoading = ({ type = 'spinner', rows = 5, text }: BaseLoadingProps) => {
    
    // 1. แบบ Skeleton Table
    if (type === 'table') {
        return (
            <div className="w-full space-y-4 p-4 animate-pulse">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <div className="h-10 w-12 rounded-full bg-slate-50" />
                        <div className="h-10 flex-1 rounded-full bg-slate-50" />
                        <div className="h-10 w-24 rounded-full bg-slate-50" />
                        <div className="h-10 w-32 rounded-full bg-slate-50" />
                    </div>
                ))}
            </div>
        );
    }

    // 2. แบบ Skeleton Card
    if (type === 'card') {
        return (
            <div className="w-full rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
                <div className="h-4 w-1/3 rounded-full bg-slate-50" />
                <div className="h-32 w-full rounded-2xl bg-slate-50" />
                <div className="space-y-2">
                    <div className="h-3 w-full rounded-full bg-slate-50" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-50" />
                </div>
            </div>
        );
    }

    // 3. แบบ Empty State (ไม่พบข้อมูล)
    if (type === 'empty') {
        return (
            <div className="flex w-full flex-col items-center justify-center py-12 font-kanit animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <Inbox size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">
                    {text || 'ไม่พบข้อมูล'}
                </h3>
                <p className="text-sm text-slate-400">
                    ขออภัย ไม่พบรายการที่คุณกำลังมองหา
                </p>
            </div>
        );
    }

    // 4. แบบ Spinner ดั้งเดิม
    return (
        <div className="flex w-full flex-col items-center justify-center py-10 font-kanit transition-all animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
                <div className="absolute h-6 w-6 rounded-full bg-blue-100 animate-pulse" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
                {text || 'กำลังโหลดข้อมูล...'}
            </p>
        </div>
    );
};

export default BaseLoading;
