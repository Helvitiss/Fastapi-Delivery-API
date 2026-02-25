import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../../api/orders';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Search, ChevronDown, ChevronUp, ReceiptText, MapPin, Calendar, CreditCard } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const BillsPage: React.FC = () => {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: orders, isLoading } = useQuery({
        queryKey: queryKeys.orders.all,
        queryFn: ordersService.getOrders,
    });

    const filteredOrders = orders?.filter(order =>
        order.id.toString().includes(searchQuery)
    );

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
                <h1 className="text-3xl font-bold mb-2">История счетов</h1>
                <p className="text-gray-500">Отслеживайте ваши расходы и статусы оплаты</p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Поиск по номеру заказа..."
                    className="input-base pl-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="card-base p-0 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100 italic">
                        <tr>
                            <th className="p-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Меню</th>
                            <th className="p-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Статус</th>
                            <th className="p-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Дата</th>
                            <th className="p-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Адрес</th>
                            <th className="p-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Сумма</th>
                            <th className="p-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Оплата</th>
                            <th className="p-5 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders?.map((order) => {
                            const isExpanded = expandedOrderId === order.id;

                            return (
                                <React.Fragment key={order.id}>
                                    <tr
                                        className={cn(
                                            "cursor-pointer transition-colors duration-200",
                                            isExpanded ? "bg-primary/5" : "hover:bg-gray-50"
                                        )}
                                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    >
                                        <td className="p-5 font-bold">Заказ #{order.id}</td>
                                        <td className="p-5"><StatusBadge status={order.status} /></td>
                                        <td className="p-5 text-sm text-gray-500">
                                            {format(new Date(order.created_at), 'dd.MM.yyyy')}
                                        </td>
                                        <td className="p-5 text-sm text-gray-600 max-w-[150px] truncate">
                                            Адрес ID: {order.address_id}
                                        </td>
                                        <td className="p-5 font-bold">{formatPrice(order.total_price)}</td>
                                        <td className="p-5 text-sm text-gray-500 italic">Наличные</td>
                                        <td className="p-5">
                                            {isExpanded ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-400" />}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-primary/5 animate-in fade-in slide-in-from-top-2">
                                            <td colSpan={7} className="p-8 border-t border-primary/10">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                    <div>
                                                        <p className="text-xs font-bold text-primary uppercase mb-4">Меню заказа</p>
                                                        <ul className="space-y-3">
                                                            {order.items.map(item => (
                                                                <li key={item.id} className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">{item.dish_name} x{item.quantity}</span>
                                                                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex gap-3">
                                                            <Calendar className="text-primary shrink-0" size={18} />
                                                            <div>
                                                                <p className="text-xs text-gray-400 font-bold uppercase">Дата</p>
                                                                <p className="text-sm font-semibold">{format(new Date(order.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <CreditCard className="text-primary shrink-0" size={18} />
                                                            <div>
                                                                <p className="text-xs text-gray-400 font-bold uppercase">Счет</p>
                                                                <p className="text-sm font-semibold">Наличными при получении</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex gap-3">
                                                            <MapPin className="text-primary shrink-0" size={18} />
                                                            <div>
                                                                <p className="text-xs text-gray-400 font-bold uppercase">Адрес</p>
                                                                <p className="text-sm font-semibold">Адрес доставки ID: {order.address_id}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <ReceiptText className="text-primary shrink-0" size={18} />
                                                            <div>
                                                                <p className="text-xs text-gray-400 font-bold uppercase">Дата оплаты</p>
                                                                <p className="text-sm font-semibold italic text-gray-400">Ожидается при доставке</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col justify-end text-right">
                                                        <p className="text-gray-500 text-sm mb-1">Итоговая сумма</p>
                                                        <p className="text-3xl font-extrabold text-primary">{formatPrice(order.total_price)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {filteredOrders?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-20 text-center">
                                    <p className="text-gray-500">Заказы не найдены</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
