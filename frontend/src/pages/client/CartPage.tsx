import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartApi } from '../../api/client';
import { Button, Card, OutlineButton } from '../../components/shared/ui';
import type { CartWithItemsResponse } from '../../types/api';

export function CartPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery<CartWithItemsResponse>({ queryKey: ['cart'], queryFn: cartApi.getCart });

  const refreshCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const updateMutation = useMutation({
    mutationFn: ({ dishId, quantity }: { dishId: number; quantity: number }) =>
      cartApi.updateItem({ dish_id: dishId, quantity }),
    onSuccess: refreshCart,
    onError: () => toast.error('Не удалось обновить количество'),
  });

  const removeMutation = useMutation({
    mutationFn: (dishId: number) => cartApi.removeItem(dishId),
    onSuccess: refreshCart,
    onError: () => toast.error('Не удалось удалить позицию'),
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: refreshCart,
    onError: () => toast.error('Не удалось очистить корзину'),
  });

  if (!data || data.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Корзина пуста</h2>
        <Link to="/menu" className="text-primary">
          Перейти в меню
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {data.items.map((item) => (
          <Card key={item.dish.id} className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{item.dish.name}</p>
                <p className="text-sm text-gray-500">{item.dish.weight ? `${item.dish.weight} г` : ''}</p>
              </div>
              <p className="font-semibold">{item.total_dish_price} ₽</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <OutlineButton
                  className="h-8 w-8 p-0"
                  onClick={() => updateMutation.mutate({ dishId: item.dish.id, quantity: Math.max(1, item.quantity - 1) })}
                >
                  -
                </OutlineButton>
                <span className="min-w-6 text-center">{item.quantity}</span>
                <OutlineButton
                  className="h-8 w-8 p-0"
                  onClick={() => updateMutation.mutate({ dishId: item.dish.id, quantity: item.quantity + 1 })}
                >
                  +
                </OutlineButton>
              </div>
              <button className="text-sm text-red-500" onClick={() => removeMutation.mutate(item.dish.id)}>
                Удалить
              </button>
            </div>
          </Card>
        ))}
        <button className="text-sm text-red-500" onClick={() => clearMutation.mutate()}>
          Очистить корзину
        </button>
      </div>

      <Card className="h-fit p-4">
        <p className="mb-3 text-lg font-semibold">Итог заказа</p>
        <p className="mb-1">Подытог: {data.total_price} ₽</p>
        <p className="mb-4">Доставка: Бесплатно</p>
        <p className="text-xl font-bold text-primary">Итого: {data.total_price} ₽</p>
        <Button className="mt-4 w-full" onClick={() => navigate('/checkout')}>
          Оформить заказ
        </Button>
      </Card>
    </div>
  );
}
