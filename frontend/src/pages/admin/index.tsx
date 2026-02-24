import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { Card, StatusBadge } from '../../components/shared/ui';

export function AdminDashboardPage() {
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: adminApi.orders.list });
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: adminApi.users.list });
  const { data: dishes = [] } = useQuery({ queryKey: ['admin-dishes'], queryFn: adminApi.dishes.list });
  const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-4">{[['Всего заказов', orders.length], ['Выручка', revenue], ['Пользователей', users.length], ['Блюд', dishes.length]].map(([k,v])=><Card key={String(k)} className="p-4"><p className="text-sm text-gray-500">{k}</p><p className="text-3xl font-bold">{v}</p></Card>)}</div></div>;
}

export function AdminOrdersPage() {
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: adminApi.orders.list });
  return <Card className="overflow-x-auto p-4"><table className="w-full"><thead><tr><th>ID</th><th>Сумма</th><th>Статус</th><th /></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>#{o.id}</td><td>{o.total_price} ₽</td><td><StatusBadge status={o.status} /></td><td><Link to={`/admin/orders/${o.id}`} className="text-primary">Открыть</Link></td></tr>)}</tbody></table></Card>;
}

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['admin-order', id], queryFn: () => adminApi.orders.getById(Number(id)) });
  if (!data) return null;
  return <Card className="p-4"><h1 className="text-2xl font-bold">Заказ #{data.id}</h1><StatusBadge status={data.status} /></Card>;
}

export function AdminDishesPage() {
  const { data: dishes = [] } = useQuery({ queryKey: ['admin-dishes'], queryFn: adminApi.dishes.list });
  return <Card className="p-4"><h1 className="mb-4 text-xl font-bold">Блюда</h1>{dishes.map(d=><div key={d.id} className="flex justify-between border-b py-2"><span>{d.name}</span><span className="text-primary">{d.price} ₽</span></div>)}</Card>;
}

export function AdminCategoriesPage() {
  const { data: categories = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: adminApi.categories.list });
  return <Card className="p-4"><h1 className="mb-4 text-xl font-bold">Категории</h1>{categories.map(c=><div key={c.id} className="border-b py-2">{c.name}</div>)}</Card>;
}

export function AdminUsersPage() {
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: adminApi.users.list });
  return <Card className="p-4"><h1 className="mb-4 text-xl font-bold">Пользователи</h1>{users.map(u=><div key={u.id} className="flex justify-between border-b py-2"><span>{u.phone_number}</span><span>{u.is_admin ? 'Администратор' : 'Пользователь'}</span></div>)}</Card>;
}
