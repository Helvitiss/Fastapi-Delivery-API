import React from 'react';
import { DishRead } from '../../types';
import { Button } from './Button';
import { Plus } from 'lucide-react';

interface DishCardProps {
    dish: DishRead;
    onAdd?: (dish: DishRead) => void;
    loading?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onAdd, loading }) => {
    const formatPrice = (price: number) => {
        return price >= 1000 ? `₽${(price / 100).toFixed(2)}` : `₽${price}`;
    };

    return (
        <div className="card-base flex flex-col h-full group">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary-light to-primary/20 flex items-center justify-center">
                {dish.image_url ? (
                    <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <span className="text-4xl font-bold text-primary opacity-40">
                        {dish.name.charAt(0)}
                    </span>
                )}
                {!dish.is_available && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Нет в наличии
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{dish.name}</h3>
                {dish.weight && (
                    <p className="text-sm text-gray-500 mb-2">{dish.weight} г</p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {dish.description || 'Вкусное блюдо высокого качества'}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-primary">
                        {formatPrice(dish.price)}
                    </span>
                    <Button
                        size="sm"
                        className="w-10 h-10 p-0 rounded-full"
                        disabled={!dish.is_available}
                        loading={loading}
                        onClick={() => onAdd?.(dish)}
                    >
                        <Plus size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
