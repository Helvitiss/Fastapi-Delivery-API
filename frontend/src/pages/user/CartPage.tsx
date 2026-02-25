import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '../../api/addresses';
import { queryKeys } from '../../api/queryKeys';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ordersService } from '../../api/orders';
import {
    Trash2, Plus, Minus, MapPin,
    ChevronRight, CreditCard, Receipt
} from 'lucide-react';

export const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, isLoading, updateItem, removeItem, clearCart } = useCart();
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const { data: addresses } = useQuery({
        queryKey: queryKeys.addresses,
        queryFn: addressService.getAddresses,
    });

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) return;
        setIsPlacingOrder(true);
        try {
            const order = await ordersService.createOrder(selectedAddressId);
            navigate(`/orders/${order.id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPlacingOrder(false);
        }
    };

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

    if (!cart || cart.items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Trash2 size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ваша корзина пуста</h2>
                <p className="text-gray-500 mb-8">
                    Кажется, вы еще ничего не добавили. Перейдите в меню, чтобы выбрать что-нибудь вкусное!
                </p>
                <Button onClick={() => navigate('/menu')}>Перейти в меню</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Items List */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Корзина</h1>
                    <button
                        onClick={() => clearCart()}
                        className="text-red-500 text-sm font-semibold hover:underline"
                    >
                        Очистить все
                    </button>
                </div>

                <div className="space-y-4">
                    {cart.items.map((item) => (
                        <div key={item.dish.id} className="card-base p-4 flex gap-4 items-center">
                            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                {item.dish.image_url ? (
                                    <img src={item.dish.image_url} alt={item.dish.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                        {item.dish.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{item.dish.name}</h3>
                                <p className="text-primary font-bold">{formatPrice(item.dish.price)}</p>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                                <button
                                    onClick={() => item.quantity > 1 ? updateItem({ dishId: item.dish.id, quantity: item.quantity - 1 }) : removeItem(item.dish.id)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors shadow-sm"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-8 text-center font-bold">{item.quantity}</span>
                                <button
                                    onClick={() => updateItem({ dishId: item.dish.id, quantity: item.quantity + 1 })}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors shadow-sm"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="w-24 text-right font-bold text-lg">
                                {formatPrice(item.total_dish_price)}
                            </div>

                            <button
                                onClick={() => removeItem(item.dish.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Panel */}
            <aside className="w-full lg:w-96 space-y-6">
                <div className="card-base sticky top-8">
                    <h3 className="text-xl font-bold mb-6">Детали заказа</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between text-gray-500">
                            <span>Сумма</span>
                            <span className="text-gray-900 font-semibold">{formatPrice(cart.total_price)}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                            <span>Сервисный сбор</span>
                            <span className="text-gray-900 font-semibold">{formatPrice(100)}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xl font-bold">
                            <span>Итого</span>
                            <span className="text-primary">{formatPrice(cart.total_price + 100)}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Адрес доставки</label>
                            <div className="space-y-2">
                                {addresses?.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${selectedAddressId === addr.id
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-gray-200 hover:border-primary-light'
                                            }`}
                                    >
                                        <MapPin size={18} className={selectedAddressId === addr.id ? 'text-primary' : 'text-gray-400'} />
                                        <span className="text-sm truncate">{addr.address}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => navigate('/addresses')}
                                    className="w-full text-center py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm hover:border-primary-light hover:text-primary transition-all"
                                >
                                    + Добавить адрес
                                </button>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14"
                            disabled={!selectedAddressId}
                            loading={isPlacingOrder}
                            onClick={handlePlaceOrder}
                        >
                            Оформить заказ
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    );
};
