import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartApi, menuApi } from '../../api/client';
import { DishCard } from '../../components/client/DishCard';
import { useAuthStore } from '../../store/authStore';
import type { CategoryRead, DishRead } from '../../types/api';

export function MenuPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data: dishes = [] } = useQuery<DishRead[]>({ queryKey: ['dishes'], queryFn: menuApi.getDishes });
  const { data: categories = [] } = useQuery<CategoryRead[]>({ queryKey: ['categories'], queryFn: menuApi.getCategories });

  const addToCartMutation = useMutation({
    mutationFn: (dishId: number) => cartApi.addItem({ dish_id: dishId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Добавлено в корзину');
    },
    onError: () => toast.error('Не удалось добавить в корзину'),
  });

  const filtered = useMemo(
    () => (categoryId ? dishes.filter((dish) => dish.category_id === categoryId) : dishes),
    [dishes, categoryId],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-4 flex gap-2 overflow-auto">
        <button onClick={() => setCategoryId(null)} className="rounded-full border px-4 py-2">
          Все категории
        </button>
        {categories.map((category) => (
          <button key={category.id} onClick={() => setCategoryId(category.id)} className="rounded-full border px-4 py-2">
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onAdd={(id) => {
              if (!token) {
                navigate('/login', { state: { from: '/menu' } });
                return;
              }
              addToCartMutation.mutate(id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
