import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, className }) => {
    return (
        <button
            type="button"
            className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                enabled ? 'bg-primary' : 'bg-gray-200',
                className
            )}
            onClick={() => onChange(!enabled)}
        >
            <span
                className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    enabled ? 'translate-x-5' : 'translate-x-0'
                )}
            />
        </button>
    );
};
