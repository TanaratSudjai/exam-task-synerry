import { BaseSwitchProps } from "@/types/swite";

const BaseSwitch = ({
    checked,
    onChange,
    label,
    description,
    activeColor = 'blue'
}: BaseSwitchProps) => {
    const activeColorClasses = {
        blue: 'bg-blue-600 focus:ring-blue-500',
        emerald: 'bg-emerald-500 focus:ring-emerald-400',
        rose: 'bg-rose-500 focus:ring-rose-400',
        amber: 'bg-amber-500 focus:ring-amber-400',
    };

    return (
        <div className="flex flex-col gap-1.5 font-kanit">
            {label && (
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(!checked)}
                    className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${checked ? activeColorClasses[activeColor] : 'bg-slate-200'}
                    `}
                >
                    <span
                        className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                            transition duration-200 ease-in-out
                            ${checked ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                </button>
                {description && (
                    <span className="text-sm text-slate-500">
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
};

export default BaseSwitch;