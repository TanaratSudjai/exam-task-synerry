const BaseBadge = ({ children, variant = 'info' }: { children: React.ReactNode, variant?: 'success' | 'danger' | 'warning' | 'info' }) => {
    const styles = {
        success: "bg-emerald-50 text-emerald-700 border-emerald-100",
        danger: "bg-red-50 text-red-700 border-red-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        info: "bg-blue-50 text-blue-700 border-blue-100",
    };
    return (
        <span className={`inline-flex items-center justify-center min-w-[75px] px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} font-kanit`}>
            {children}
        </span>
    );
};

export default BaseBadge;