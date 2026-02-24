import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cartApi, menuApi } from '../../api/client';
import { DishCard } from '../../components/client/DishCard';
import { useAuthStore } from '../../store/authStore';

export function MenuPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { data: dishes = [] } = useQuery({ queryKey: ['dishes'], queryFn: menuApi.getDishes });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: menuApi.getCategories });
  const filtered = useMemo(() => categoryId ? dishes.filter((d) => d.category_id === categoryId) : dishes, [dishes, categoryId]);

  return <div className="mx-auto max-w-7xl px-6 py-8"><div className="mb-4 flex gap-2 overflow-auto"><button onClick={()=>setCategoryId(null)} className="rounded-full border px-4 py-2">Все категории</button>{categories.map(c=><button key={c.id} onClick={()=>setCategoryId(c.id)} className="rounded-full border px-4 py-2">{c.name}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((dish)=><DishCard key={dish.id} dish={dish} onAdd={async (id)=>{if(!token)return navigate('/login'); await cartApi.addItem({dish_id:id,quantity:1});}} />)}</div></div>;
}
