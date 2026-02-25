import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuService } from '../../api/menu';
import { queryKeys } from '../../api/queryKeys';
import { DishCard } from '../../components/ui/DishCard';
import { Spinner } from '../../components/ui/Spinner';
import { useCart } from '../../hooks/useCart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const DashboardPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { addItem, isAdding } = useCart();

    const { data: dishes, isLoading: dishesLoading } = useQuery({
        queryKey: queryKeys.dishes.all,
        queryFn: menuService.getDishes,
    });

    const { data: categories, isLoading: catsLoading } = useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: menuService.getCategories,
    });

    const filteredDishes = dishes?.filter(dish =>
        selectedCategory === null || dish.category_id === selectedCategory
    ).slice(0, 6);

    if (dishesLoading || catsLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary-dark to-primary p-12 text-white">
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                        Получите ваучер на скидку до <span className="text-primary-light">20%</span>
                    </h1>
                    <p className="text-primary-light/90 mb-8">
                        Заказывайте любимые блюда из лучших ресторанов города прямо к себе домой или в офис.
                    </p>
                    <button className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-primary-light transition-colors">
                        Получить сейчас
                    </button>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-1/4" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl" />
            </div>

            {/* Categories */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Категории</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                            "whitespace-nowrap px-6 py-2.5 rounded-full font-semibold transition-all border",
                            selectedCategory === null
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white text-gray-500 border-gray-200 hover:border-primary-light"
                        )}
                    >
                        Все блюда
                    </button>
                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "whitespace-nowrap px-6 py-2.5 rounded-full font-semibold transition-all border",
                                selectedCategory === cat.id
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-primary-light"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Popular Dishes */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Популярные блюда</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDishes?.map((dish) => (
                        <DishCard
                            key={dish.id}
                            dish={dish}
                            onAdd={(d) => addItem({ dishId: d.id, quantity: 1 })}
                            loading={isAdding}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
