import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  CircleUserRound,
  Cog,
  CreditCard,
  Heart,
  MapPin,
  MessageCircleMore,
  Pizza,
  Search,
  Settings,
  ShoppingBasket,
  Soup,
  UtensilsCrossed,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cartApi, menuApi } from '../../api/client';
import type { CategoryRead, DishRead } from '../../types/api';
import { useAuthStore } from '../../store/authStore';

const sideNav = [
  { label: 'Dashboard', icon: UtensilsCrossed, active: true },
  { label: 'Food Order', icon: ShoppingBasket },
  { label: 'Favorite', icon: Heart },
  { label: 'Message', icon: MessageCircleMore },
  { label: 'Order History', icon: CreditCard },
  { label: 'Setting', icon: Settings },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function CategoryCard({ category }: { category: CategoryRead }) {
  return (
    <button className="flex min-w-[132px] flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-soft transition hover:-translate-y-1">
      <div className="rounded-full bg-accent p-3 text-primary">
        <Pizza size={22} />
      </div>
      <p className="text-sm font-medium text-[#6E6B7B]">{category.name}</p>
    </button>
  );
}

function ProductCard({ dish, onAdd }: { dish: DishRead; onAdd: (dishId: number) => void }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-start justify-between">
        <span className="rounded-lg bg-[#FF6B6B] px-3 py-1 text-xs font-semibold text-white">15% Off</span>
        <Heart size={17} className="text-gray-300" />
      </div>
      <div className="mb-2 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#F7F7F8]">
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="h-full w-full object-cover" />
        ) : (
          <Soup size={40} className="text-gray-300" />
        )}
      </div>
      <p className="line-clamp-1 font-semibold text-[#2E2E2E]">{dish.name}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-xl font-bold text-[#2E2E2E]">{formatPrice(dish.price)}</p>
        <button
          className="h-9 w-9 rounded-xl bg-primary text-xl text-white disabled:opacity-60"
          onClick={() => onAdd(dish.id)}
          disabled={!dish.is_available}
        >
          +
        </button>
      </div>
    </article>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { data: dishes = [] } = useQuery({ queryKey: ['dishes'], queryFn: menuApi.getDishes });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: menuApi.getCategories });

  const topDishes = dishes.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#2D2D2D]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-[220px_1fr_310px]">
        <aside className="bg-[#F8F8F8] p-6 lg:min-h-screen">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight">GoMeal<span className="text-primary">.</span></h1>
          <nav className="space-y-2">
            {sideNav.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active ? 'bg-[#F7B500] text-white' : 'text-[#8D8AA6] hover:bg-white'}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="p-6 lg:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-4xl font-extrabold">Hello, Patricia</h2>
            <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl bg-white px-4 py-3">
              <Search size={19} className="text-primary" />
              <input className="w-full bg-transparent outline-none" placeholder="What do you want eat today..." />
            </div>
          </header>

          <section className="mb-7 overflow-hidden rounded-2xl bg-[#F7B500] p-7 text-white shadow-soft">
            <div className="max-w-md space-y-2">
              <h3 className="text-5xl font-extrabold leading-tight">Get Discount Voucher Up To 20%</h3>
              <p className="text-sm opacity-95">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
            </div>
          </section>

          <section className="mb-9">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold">Category</h3>
              <button className="font-medium text-primary">View all</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold">Popular Dishes</h3>
              <button className="font-medium text-primary">View all</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topDishes.map((dish) => (
                <ProductCard
                  key={dish.id}
                  dish={dish}
                  onAdd={async (dishId) => {
                    if (!token) {
                      navigate('/login');
                      return;
                    }
                    await cartApi.addItem({ dish_id: dishId, quantity: 1 });
                  }}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className="border-l border-[#EAEAEA] bg-[#FAFAFA] p-6">
          <div className="mb-8 flex items-center justify-end gap-4 text-[#646464]">
            <Bell size={18} />
            <Cog size={18} />
            <CircleUserRound size={30} />
          </div>

          <section className="mb-6">
            <h3 className="mb-3 text-3xl font-bold">Your Balance</h3>
            <div className="rounded-2xl bg-[#F7B500] p-5 text-white shadow-soft">
              <p className="text-sm opacity-90">Balance</p>
              <p className="text-4xl font-black">$12.000</p>
            </div>
          </section>

          <section className="mb-8">
            <h4 className="mb-2 text-sm text-[#949494]">Your Address</h4>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin size={16} className="text-primary" />
              Elm Street, 23
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-3xl font-bold">Order Menu</h3>
            <div className="space-y-4">
              {topDishes.slice(0, 3).map((dish) => (
                <div key={dish.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-[#F1F1F1]">
                      {dish.image_url ? <img src={dish.image_url} alt={dish.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{dish.name}</p>
                      <p className="text-xs text-[#9A9A9A]">x1</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">{formatPrice(dish.price)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#E5E5E5] pt-4 text-sm">
              <div className="flex justify-between"><span>Service</span><span>+100 ₽</span></div>
              <div className="flex justify-between text-2xl font-bold"><span>Total</span><span>{formatPrice(topDishes.slice(0, 3).reduce((acc, item) => acc + item.price, 0) + 100)}</span></div>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-[#F7B500] py-4 text-lg font-bold text-white">Checkout</button>
          </section>
        </aside>
      </div>
    </div>
  );
}
