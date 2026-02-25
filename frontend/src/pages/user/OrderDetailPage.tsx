import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../../api/orders';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeft, MapPin, Clock, CreditCard } from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: order, isLoading } = useQuery({
        queryKey: queryKeys.orders.detail(Number(id)),
        queryFn: () => ordersService.getOrder(Number(id)),
        enabled: !!id,
    });

    const formatPrice = (price: number) => {
        return price >= 1000 ? `₽${(price / 100).toFixed(2)}` : `₽${price}`;
    };

    const steps: { status: OrderStatus; label: string }[] = [
        { status: 'new', label: 'Новый' },
        { status: 'confirmed', label: 'Принят' },
        { status: 'cooking', label: 'Готовится' },
        { status: 'delivering', label: 'Доставка' },
        { status: 'completed', label: 'Завершен' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order?.status);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary font-semibold transition-colors"
            >
                <ArrowLeft size={20} /> Назад
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Заказ №{order.id}</h1>
                    <p className="text-gray-500">
                        Оформлен {format(new Date(order.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                    </p>
                </div>
                <StatusBadge status={order.status} className="w-fit text-sm px-4 py-2" />
            </div>

            {/* Timeline */}
            <div className="card-base py-10 px-8">
                <div className="relative flex justify-between">
                    <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-gray-100 -z-0" />
                    <div
                        className="absolute top-[18px] left-[10%] h-[2px] bg-primary transition-all duration-1000 -z-0"
                        style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 80}%` }}
                    />

                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-100 text-gray-300'
                                    } ${isCurrent ? 'ring-4 ring-primary/20 animate-pulse' : ''}`}>
                                    {idx + 1}
                                </div>
                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold">Блюда</h3>
                    <div className="card-base p-0 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Наименование</th>
                                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Кол-во</th>
                                    <th className="text-right py-4 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Цена</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-6 font-semibold text-gray-900">{item.dish_name}</td>
                                        <td className="py-4 px-6 text-center text-gray-600">x{item.quantity}</td>
                                        <td className="py-4 px-6 text-right font-bold">{formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-bold text-lg">
                                <tr>
                                    <td colSpan={2} className="py-6 px-6 text-right">Итого:</td>
                                    <td className="py-6 px-6 text-right text-primary">{formatPrice(order.total_price)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Информация</h3>

                    <div className="card-base space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                <MapPin size={20} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Адрес доставки</p>
                                <p className="text-sm font-semibold">Загрузка адреса...</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                <Clock size={20} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Время оформления</p>
                                <p className="text-sm font-semibold">
                                    {format(new Date(order.created_at), 'HH:mm:ss d/MM/yyyy')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                <CreditCard size={20} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Метод оплаты</p>
                                <p className="text-sm font-semibold italic text-gray-400">Оплата при получении</p>
                            </div>
                        </div>
                    </div>

                    {order.comment && (
                        <div className="card-base bg-amber-50 border-amber-100">
                            <p className="text-xs text-amber-500 font-bold uppercase mb-2">Комментарий к заказу</p>
                            <p className="text-sm text-gray-700 italic">"{order.comment}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
