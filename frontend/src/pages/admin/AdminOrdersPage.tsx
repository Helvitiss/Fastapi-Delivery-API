import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';
import { OrderStatus } from '../../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const statusTabs: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'Все', value: 'all' },
    { label: 'Новые', value: 'new' },
    { label: 'Принятые', value: 'confirmed' },
    { label: 'Готовятся', value: 'cooking' },
    { label: 'Доставка', value: 'delivering' },
    { label: 'Завершенные', value: 'completed' },
    { label: 'Отмененные', value: 'cancelled' },
];

export const AdminOrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: queryKeys.admin.orders,
        queryFn: adminService.getOrders,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
            adminService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders });
        },
    });

    const filteredOrders = orders?.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch = order.id.toString().includes(searchQuery);
        return matchesTab && matchesSearch;
    });

    const formatPrice = (price: number) => {
        return price >= 1000 ? `₽${(price / 100).toFixed(2)}` : `₽${price}`;
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Управление заказами</h1>
                <p className="text-gray-500">Просмотр и обновление статусов заказов</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={cn(
                            "whitespace-nowrap px-5 py-2.5 rounded-full font-semibold text-sm transition-all border",
                            activeTab === tab.value
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-500 border-gray-200 hover:border-primary-light"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Поиск по номеру заказа..."
                    className="input-base pl-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="card-base p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">ID</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Дата</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Пользователь</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Блюда</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Сумма</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Статус</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders?.map((order) => {
                            const isExpanded = expandedId === order.id;
                            return (
                                <React.Fragment key={order.id}>
                                    <tr
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            isExpanded ? "bg-primary/5" : "hover:bg-gray-50"
                                        )}
                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                    >
                                        <td className="p-4 font-bold">#{order.id}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                                        </td>
                                        <td className="p-4 text-sm">ID: {order.user_id}</td>
                                        <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {order.items.map(i => i.dish_name).join(', ')}
                                        </td>
                                        <td className="p-4 font-bold text-primary">{formatPrice(order.total_price)}</td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                                                value={order.status}
                                                onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                                            >
                                                <option value="new">Новый</option>
                                                <option value="confirmed">Принят</option>
                                                <option value="cooking">Готовится</option>
                                                <option value="delivering">Доставка</option>
                                                <option value="completed">Завершен</option>
                                                <option value="cancelled">Отменен</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            {isExpanded ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-gray-400" />}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-primary/5">
                                            <td colSpan={7} className="p-6 border-t border-primary/10">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-xs font-bold text-primary uppercase mb-3">Состав заказа</p>
                                                        <ul className="space-y-2">
                                                            {order.items.map(item => (
                                                                <li key={item.id} className="flex justify-between text-sm bg-white p-3 rounded-lg">
                                                                    <span>{item.dish_name} × {item.quantity}</span>
                                                                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-3 text-sm">
                                                        <p><span className="text-gray-400">Адрес:</span> ID {order.address_id}</p>
                                                        {order.comment && <p><span className="text-gray-400">Комментарий:</span> {order.comment}</p>}
                                                        <p className="text-2xl font-extrabold text-primary pt-4">{formatPrice(order.total_price)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
