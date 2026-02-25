import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';

// Layouts
import { UserLayout } from '../components/layout/UserLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('../pages/user/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MenuPage = lazy(() => import('../pages/user/MenuPage').then(m => ({ default: m.MenuPage })));
const CartPage = lazy(() => import('../pages/user/CartPage').then(m => ({ default: m.CartPage })));
const OrdersPage = lazy(() => import('../pages/user/OrdersPage').then(m => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('../pages/user/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const AddressesPage = lazy(() => import('../pages/user/AddressesPage').then(m => ({ default: m.AddressesPage })));
const BillsPage = lazy(() => import('../pages/user/BillsPage').then(m => ({ default: m.BillsPage })));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminDishesPage = lazy(() => import('../pages/admin/AdminDishesPage').then(m => ({ default: m.AdminDishesPage })));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));

const PageSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
    </div>
);

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Suspense fallback={<PageSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
    },
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        element: <UserLayout />,
        children: [
            { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
            { path: '/menu', element: <SuspenseWrapper><MenuPage /></SuspenseWrapper> },
            { path: '/cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
            { path: '/orders', element: <SuspenseWrapper><OrdersPage /></SuspenseWrapper> },
            { path: '/orders/:id', element: <SuspenseWrapper><OrderDetailPage /></SuspenseWrapper> },
            { path: '/addresses', element: <SuspenseWrapper><AddressesPage /></SuspenseWrapper> },
            { path: '/bills', element: <SuspenseWrapper><BillsPage /></SuspenseWrapper> },
        ],
    },
    {
        element: <AdminLayout />,
        children: [
            { path: '/admin', element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
            { path: '/admin/dishes', element: <SuspenseWrapper><AdminDishesPage /></SuspenseWrapper> },
            { path: '/admin/categories', element: <SuspenseWrapper><AdminCategoriesPage /></SuspenseWrapper> },
            { path: '/admin/orders', element: <SuspenseWrapper><AdminOrdersPage /></SuspenseWrapper> },
            { path: '/admin/users', element: <SuspenseWrapper><AdminUsersPage /></SuspenseWrapper> },
        ],
    },
]);
