import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuService } from '../../api/menu';
import { queryKeys } from '../../api/queryKeys';
import { DishCard } from '../../components/ui/DishCard';
import { Spinner } from '../../components/ui/Spinner';
import { useCart } from '../../hooks/useCart';
import { Search, SlidersHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const MenuPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { addItem, isAdding } = useCart();

    const { data: dishes, isLoading: dishesLoading } = useQuery({
        queryKey: queryKeys.dishes.all,
        queryFn: menuService.getDishes,
    });

    const { data: categories, isLoading: catsLoading } = useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: menuService.getCategories,
    });

    const filteredDishes = dishes?.filter(dish => {
        const matchesCategory = selectedCategory === null || dish.category_id === selectedCategory;
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (dishesLoading || catsLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex gap-8">
            {/* Categories Sidebar */}
            <aside className="w-64 shrink-0 space-y-2 sticky top-8 h-fit">
                <h3 className="text-lg font-bold mb-4 px-4">Категории</h3>
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors",
                        selectedCategory === null ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
                    )}
                >
                    Все меню
                </button>
                {categories?.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors",
                            selectedCategory === cat.id ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
                <header className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Поиск любимой еды..."
                            className="input-base pl-12 h-14"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="h-14 w-14 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-primary transition-colors">
                        <SlidersHorizontal size={24} className="text-gray-400" />
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDishes?.map((dish) => (
                        <DishCard
                            key={dish.id}
                            dish={dish}
                            onAdd={(d) => addItem({ dishId: d.id, quantity: 1 })}
                            loading={isAdding}
                        />
                    ))}
                    {filteredDishes?.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 text-lg">Ничего не найдено по вашему запросу</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
