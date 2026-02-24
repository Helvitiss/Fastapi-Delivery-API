import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/client';
import { Card, StatusBadge } from '../../components/shared/ui';

export function OrdersPage() {
  const { data = [] } = useQuery({ queryKey: ['orders'], queryFn: ordersApi.list });
  return <div className="mx-auto max-w-5xl space-y-4 px-6 py-8"><h1 className="text-2xl font-bold">Мои заказы</h1>{data.map((o)=><Card key={o.id} className="p-4"><div className="flex justify-between"><p className="font-semibold">Заказ #{o.id}</p><StatusBadge status={o.status} /></div><p className="mt-2 text-primary font-bold">{o.total_price} ₽</p><Link className="text-sm text-primary" to={`/orders/${o.id}`}>Подробнее</Link></Card>)}</div>;
}
