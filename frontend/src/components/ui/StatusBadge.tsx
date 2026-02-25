import React from 'react';
import { OrderStatus } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
    status: OrderStatus;
    className?: string;
}

const statusMap: Record<OrderStatus, { label: string; className: string }> = {
    new: { label: 'Новый', className: 'bg-indigo-100 text-indigo-700' },
    confirmed: { label: 'Подтвержден', className: 'bg-blue-100 text-blue-700' },
    cooking: { label: 'Готовится', className: 'bg-amber-100 text-amber-700' },
    delivering: { label: 'Доставляется', className: 'bg-purple-100 text-purple-700' },
    completed: { label: 'Завершен', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Отменен', className: 'bg-red-100 text-red-700' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    const config = statusMap[status];

    return (
        <span
            className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
};
