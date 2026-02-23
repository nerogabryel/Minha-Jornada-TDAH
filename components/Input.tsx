import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    id,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xs font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wider"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium text-[rgb(var(--color-eel))] placeholder-[rgb(var(--color-hare))] bg-[rgb(var(--color-polar))] border-2 border-[rgb(var(--color-swan))] focus:border-[rgb(var(--color-macaw))] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-macaw))]/20 transition-all duration-200 min-h-[44px] ${className}`}
                {...props}
            />
        </div>
    );
};