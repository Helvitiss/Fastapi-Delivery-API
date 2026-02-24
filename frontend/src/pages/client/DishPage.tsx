import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { menuApi } from '../../api/client';

export function DishPage() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['dish', id], queryFn: () => menuApi.getDish(Number(id)) });
  if (!data) return <div className="p-8">Загрузка...</div>;
  return <div className="mx-auto max-w-4xl p-8"><h1 className="text-3xl font-bold">{data.name}</h1><p className="mt-4 text-gray-600">{data.description}</p><p className="mt-4 text-2xl font-bold text-primary">{data.price} ₽</p></div>;
}
