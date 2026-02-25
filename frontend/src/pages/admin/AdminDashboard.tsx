import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';
import { OrderStatus } from '../../types';
import {
    ShoppingBag, Users, DollarSign,
    UtensilsCrossed, TrendingUp, Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: orders, isLoading: ordersLoading } = useQuery({
        queryKey: queryKeys.admin.orders,
        queryFn: adminService.getOrders,
    });

    const { data: dishes, isLoading: dishesLoading } = useQuery({
        queryKey: queryKeys.admin.dishes,
        queryFn: adminService.getDishes,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
            adminService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders });
        },
    });

    const stats = [
        {
            label: 'Всего заказов',
            value: orders?.length || 0,
            icon: ShoppingBag,
            color: 'bg-blue-500'
        },
        {
            label: 'Активные заказы',
            value: orders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length || 0,
            icon: Clock,
            color: 'bg-amber-500'
        },
        {
            label: 'Общая выручка',
            value: (orders?.reduce((acc, o) => acc + o.total_price, 0) || 0) >= 1000
                ? `₽${((orders?.reduce((acc, o) => acc + o.total_price, 0) || 0) / 100).toFixed(2)}`
                : `₽${orders?.reduce((acc, o) => acc + o.total_price, 0) || 0}`,
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            label: 'Всего блюд',
            value: dishes?.length || 0,
            icon: UtensilsCrossed,
            color: 'bg-purple-500'
        },
    ];

    if (ordersLoading || dishesLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">Обзор управления</h1>
                <p className="text-gray-500">Панель мониторинга работы сервиса доставки</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="card-base p-6 flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase mb-1">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Последние заказы</h2>
                </div>

                <div className="card-base p-0 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-left font-bold text-gray-500">ID</th>
                                <th className="p-4 text-left font-bold text-gray-500">Пользователь</th>
                                <th className="p-4 text-left font-bold text-gray-500">Сумма</th>
                                <th className="p-4 text-left font-bold text-gray-500">Статус</th>
                                <th className="p-4 text-left font-bold text-gray-500">Дата</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders?.slice(0, 10).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold">#{order.id}</td>
                                    <td className="p-4 text-sm font-medium">Пользователь {order.user_id}</td>
                                    <td className="p-4 font-bold text-primary">
                                        {order.total_price >= 1000 ? `₽${(order.total_price / 100).toFixed(2)}` : `₽${order.total_price}`}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
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
                                    <td className="p-4 text-sm text-gray-500">
                                        {format(new Date(order.created_at), 'dd.MM HH:mm')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
