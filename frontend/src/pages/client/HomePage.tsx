import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { menuApi, cartApi } from '../../api/client';
import { DishCard } from '../../components/client/DishCard';
import { useAuthStore } from '../../store/authStore';

export function HomePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { data: dishes = [] } = useQuery({ queryKey: ['dishes'], queryFn: menuApi.getDishes });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: menuApi.getCategories });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <section className="rounded-3xl bg-gradient-to-br from-primary to-orange-400 p-8 text-white">
        <h1 className="text-4xl font-bold">Быстрая доставка любимой еды</h1>
        <p className="mt-2">Выбирайте блюда из свежего меню за пару минут.</p>
        <Link className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-primary" to="/menu">Смотреть меню</Link>
      </section>
      <section><h2 className="mb-4 text-2xl font-bold">Категории</h2><div className="flex gap-2 overflow-x-auto">{categories.map((c)=><span key={c.id} className="rounded-full bg-white px-4 py-2 shadow">{c.name}</span>)}</div></section>
      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold">Популярное</h2><Link className="text-primary" to="/menu">Все блюда →</Link></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.slice(0, 8).map((dish) => (
            <DishCard key={dish.id} dish={dish} onAdd={async (dishId) => {
              if (!token) return navigate('/login');
              await cartApi.addItem({ dish_id: dishId, quantity: 1 });
            }} />
          ))}
        </div>
      </section>
    </div>
  );
}
