import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { HomePage } from './pages/client/HomePage';
import { MenuPage } from './pages/client/MenuPage';
import { DishPage } from './pages/client/DishPage';
import { CartPage } from './pages/client/CartPage';
import { CheckoutPage } from './pages/client/CheckoutPage';
import { OrdersPage } from './pages/client/OrdersPage';
import { OrderDetailPage } from './pages/client/OrderDetailPage';
import { LoginPage } from './pages/client/LoginPage';
import { AdminDashboardPage, AdminOrdersPage, AdminOrderDetailPage, AdminDishesPage, AdminCategoriesPage, AdminUsersPage } from './pages/admin';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/menu', element: <MenuPage /> },
  { path: '/dish/:id', element: <DishPage /> },
  { path: '/cart', element: <ProtectedRoute><CartPage /></ProtectedRoute> },
  { path: '/checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
  { path: '/orders', element: <ProtectedRoute><OrdersPage /></ProtectedRoute> },
  { path: '/orders/:id', element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute adminOnly><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>,
  },
  { path: '/admin/orders', element: <ProtectedRoute adminOnly><AdminLayout><AdminOrdersPage /></AdminLayout></ProtectedRoute> },
  { path: '/admin/orders/:id', element: <ProtectedRoute adminOnly><AdminLayout><AdminOrderDetailPage /></AdminLayout></ProtectedRoute> },
  { path: '/admin/dishes', element: <ProtectedRoute adminOnly><AdminLayout><AdminDishesPage /></AdminLayout></ProtectedRoute> },
  { path: '/admin/categories', element: <ProtectedRoute adminOnly><AdminLayout><AdminCategoriesPage /></AdminLayout></ProtectedRoute> },
  { path: '/admin/users', element: <ProtectedRoute adminOnly><AdminLayout><AdminUsersPage /></AdminLayout></ProtectedRoute> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
