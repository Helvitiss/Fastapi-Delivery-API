import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, ShoppingCart,
    History, MapPin, LogOut, ShieldCheck, ListTree
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
    const { logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userLinks = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Обзор' },
        { to: '/menu', icon: UtensilsCrossed, label: 'Меню' },
        { to: '/cart', icon: ShoppingCart, label: 'Корзина' },
        { to: '/orders', icon: History, label: 'Заказы' },
        { to: '/addresses', icon: MapPin, label: 'Адреса' },
    ];

    const adminLinks = [
        { to: '/admin', icon: ShieldCheck, label: 'Дашборд' },
        { to: '/admin/dishes', icon: UtensilsCrossed, label: 'Блюда' },
        { to: '/admin/categories', icon: ListTree, label: 'Категории' },
        { to: '/admin/orders', icon: History, label: 'Заказы' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <aside className="w-64 fixed h-full flex flex-col bg-sidebar-bg text-sidebar-text py-8 z-40">
            <div className="px-8 mb-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <UtensilsCrossed size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">FoodMeal</span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-primary/10 text-primary border-l-4 border-primary rounded-l-none"
                                : "hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Выйти</span>
                </button>
            </div>
        </aside>
    );
};
