import { Loader2 } from 'lucide-react';
import { BaseSpinnerProps } from '@/types/spiner';

const BaseSpinner = ({
    show = true,
    text = "กำลังโหลด...",
    description = "Please wait",
    fullScreen = true,
    activeColor = 'blue'
}: BaseSpinnerProps) => {
    if (!show) return null;

    const colorClasses = {
        blue: 'text-blue-600',
        emerald: 'text-emerald-500',
        rose: 'text-rose-500',
        amber: 'text-amber-500',
    };

    const containerStyle = fullScreen
        ? "fixed inset-0 z-[9999] bg-white/70 backdrop-blur-[2px]"
        : "relative py-12 w-full";

    return (
        <div className={`${containerStyle} flex flex-col items-center justify-center font-kanit animate-in fade-in duration-300`}>
            <div className={`relative flex items-center justify-center ${colorClasses[activeColor]}`}>
                <Loader2 size={48} className="animate-spin" />
            </div>

            <div className="mt-5 flex flex-col items-center gap-1">
                {text && (
                    <span className="text-sm font-bold text-slate-700 tracking-wide">
                        {text}
                    </span>
                )}
                {description && (
                    <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
};

export default BaseSpinner;
