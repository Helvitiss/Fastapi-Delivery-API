import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ordersApi } from '../../api/client';
import { Card, StatusBadge } from '../../components/shared/ui';

export function OrderDetailPage() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['order', id], queryFn: () => ordersApi.getById(Number(id)) });
  if (!data) return <div className="p-8">Загрузка...</div>;
  return <div className="mx-auto max-w-4xl px-6 py-8"><Card className="p-4"><div className="flex justify-between"><h1 className="text-2xl font-bold">Заказ #{data.id}</h1><StatusBadge status={data.status} /></div>{data.items.map(i=><div key={i.id} className="mt-2 flex justify-between"><span>{i.dish_name} × {i.quantity}</span><span>{i.price * i.quantity} ₽</span></div>)}</Card></div>;
}
