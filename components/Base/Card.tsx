import React from 'react'

type BaseCardProps = {
    children: React.ReactNode;
    className?: string;
}

function BaseCard({ children, className = '' }: BaseCardProps) {
    return (
        <div className={`w-full bg-white space-y-2 p-5 border border-gray-200 rounded-xl ${className}`.trim()}>
            {children}
        </div>
    )
}

export default BaseCard
