import React from 'react'
import { ButtonProps } from '@/types/button';

const BaseButton = ({
    children,
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {

    // 1. จัดการ Base & Layout Styles
    const baseStyles = "inline-flex items-center justify-center gap-2 font-kanit transition-all duration-200 active:scale-95 select-none focus:outline-none focus:ring-2 focus:ring-offset-2";

    // 2. Variants (เพิ่ม Ghost และ Link)
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:ring-blue-500",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm focus:ring-red-400",
        outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        link: "bg-transparent text-blue-600 hover:underline px-0 py-0 h-auto shadow-none",
        emerald: "bg-emerald-500 text-white hover:bg-emerald-700 shadow-sm focus:ring-emerald-500",
        cancle: "bg-[#CDEAFF] text-black shadow-sm focus:ring-[#2ECC71]",
    };

    // 3. Sizes
    const sizes = {
        sm: "px-3 py-1.5 text-xs h-8",
        md: "px-5 py-2.5 text-sm h-10",
        lg: "px-7 py-3.5 text-base h-12",
    };

    // 4. Shapes
    const shapes = {
        rounded: "rounded-lg",
        full: "rounded-full",
        square: "rounded-none",
    };

    // รวม Logic ของ Tailwind Classes
    const widthClass = fullWidth ? "w-full" : "";
    const stateClass = (disabled || isLoading) ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer";
    const iconSize = size === 'lg' ? "w-5 h-5" : "w-4 h-4";

    return (
        <button
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${shapes[shape]} 
        ${widthClass} 
        ${stateClass} 
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    {/* Spinner Customization */}
                    <svg className={`animate-spin ${iconSize} text-current`} viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {children && <span>{children}</span>}
                </div>
            ) : (
                <>
                    {leftIcon && <span className={`${iconSize} flex items-center justify-center`}>{leftIcon}</span>}
                    {children && <span className="truncate">{children}</span>}
                    {rightIcon && <span className={`${iconSize} flex items-center justify-center`}>{rightIcon}</span>}
                </>
            )}
        </button>
    );
}

export default BaseButton;