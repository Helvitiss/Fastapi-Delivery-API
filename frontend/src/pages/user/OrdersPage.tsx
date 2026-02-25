import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../../api/orders';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronRight, PackageCheck } from 'lucide-react';

export const OrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: orders, isLoading } = useQuery({
        queryKey: queryKeys.orders.all,
        queryFn: ordersService.getOrders,
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

    if (!orders || orders.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <PackageCheck size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">У вас еще нет заказов</h2>
                <p className="text-gray-500 mb-8">
                    Ваши будущие заказы будут отображаться здесь. Время что-нибудь попробовать!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Мои заказы</h1>

            <div className="grid gap-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="card-base p-6 hover:border-primary-light transition-all cursor-pointer flex items-center gap-6 group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold">#{order.id}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg font-bold">Заказ №{order.id}</span>
                                <StatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-gray-500">
                                {format(new Date(order.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 truncate">
                                {order.items.map(i => `${i.dish_name} x${i.quantity}`).join(', ')}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{formatPrice(order.total_price)}</p>
                            <div className="inline-flex items-center text-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
                                Детали <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
