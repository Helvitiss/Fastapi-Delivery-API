import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ordersApi } from '../../api/client';
import { Card, StatusBadge } from '../../components/shared/ui';
import type { OrderRead } from '../../types/api';

export function OrderDetailPage() {
  const { id } = useParams();
  const { data } = useQuery<OrderRead>({ queryKey: ['order', id], queryFn: () => ordersApi.getById(Number(id)) });

  if (!data) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Card className="p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Заказ #{data.id}</h1>
          <StatusBadge status={data.status} />
        </div>
        <p className="mt-2 text-sm text-gray-500">{new Date(data.created_at).toLocaleString('ru-RU')}</p>
        {data.items.map((item) => (
          <div key={item.id} className="mt-2 flex justify-between">
            <span>
              {item.dish_name} × {item.quantity}
            </span>
            <span>{item.price * item.quantity} ₽</span>
          </div>
        ))}
        <div className="mt-4 border-t pt-3 text-right text-xl font-bold text-primary">{data.total_price} ₽</div>
      </Card>
    </div>
  );
}
