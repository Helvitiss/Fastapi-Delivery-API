import clsx from 'clsx';
import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from 'react';
import type { OrderStatus } from '../../types/api';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx('rounded-xl px-4 py-2 font-medium transition disabled:opacity-50 bg-primary text-white hover:bg-[#E85D25]', className)} {...props} />;
}

export function OutlineButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx('rounded-xl px-4 py-2 font-medium transition border border-primary text-primary hover:bg-accent', className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx('h-12 w-full rounded-xl border border-border px-3 outline-none focus:border-primary', className)} {...props} />;
}

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('rounded-2xl bg-white shadow-soft', className)}>{children}</div>;
}

const statusMap: Record<OrderStatus, string> = {
  new: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  cooking: 'bg-orange-100 text-orange-700',
  delivering: 'bg-violet-100 text-violet-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusRu: Record<OrderStatus, string> = {
  new: '🟡 Новый',
  confirmed: '🔵 Подтверждён',
  cooking: '🟠 Готовится',
  delivering: '🟣 Доставляется',
  completed: '🟢 Выполнен',
  cancelled: '🔴 Отменён',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', statusMap[status])}>{statusRu[status]}</span>;
}
