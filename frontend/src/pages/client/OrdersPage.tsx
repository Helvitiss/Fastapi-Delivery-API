import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/client';
import { Card, StatusBadge } from '../../components/shared/ui';
import type { OrderRead } from '../../types/api';

export function OrdersPage() {
  const { data = [] } = useQuery<OrderRead[]>({ queryKey: ['orders'], queryFn: ordersApi.list });

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-6 py-8">
      <h1 className="text-2xl font-bold">Мои заказы</h1>
      {data.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between">
            <p className="font-semibold">Заказ #{order.id}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-sm text-gray-500">{new Date(order.created_at).toLocaleString('ru-RU')}</p>
          <p className="mt-2 font-bold text-primary">{order.total_price} ₽</p>
          <Link className="text-sm text-primary" to={`/orders/${order.id}`}>
            Подробнее
          </Link>
        </Card>
      ))}
    </div>
  );
}
