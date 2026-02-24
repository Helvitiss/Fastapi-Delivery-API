import { Bell, ClipboardList, LayoutDashboard, Tag, Users, UtensilsCrossed } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

const nav = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Заказы', icon: ClipboardList },
  { to: '/admin/dishes', label: 'Блюда', icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Категории', icon: Tag },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
];

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <aside className="hidden w-64 flex-col bg-secondary p-4 text-white md:flex">
        <Link to="/admin" className="mb-4 text-lg font-bold">Admin Panel</Link>
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `mb-2 flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/10'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1">
        <header className="flex h-16 items-center justify-end border-b bg-white px-6"><Bell size={20} /></header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
