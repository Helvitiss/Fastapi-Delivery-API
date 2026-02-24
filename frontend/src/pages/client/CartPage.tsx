import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../../api/client';
import { Button, Card } from '../../components/shared/ui';

export function CartPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ['cart'], queryFn: cartApi.getCart });
  if (!data?.items.length) return <div className="p-8 text-center"><h2 className="text-2xl font-bold">Корзина пуста</h2><Link to="/menu" className="text-primary">Перейти в меню</Link></div>;
  return <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-3"><div className="space-y-3 lg:col-span-2">{data.items.map((item)=><Card key={item.dish.id} className="flex items-center justify-between p-4"><div><p className="font-semibold">{item.dish.name}</p><p>{item.total_dish_price} ₽</p></div><Button onClick={async()=>{await cartApi.removeItem(item.dish.id);qc.invalidateQueries({queryKey:['cart']});}}>Удалить</Button></Card>)}</div><Card className="h-fit p-4"><p>Итого: {data.total_price} ₽</p><Button className="mt-4 w-full" onClick={()=>navigate('/checkout')}>Оформить заказ</Button></Card></div>;
}
