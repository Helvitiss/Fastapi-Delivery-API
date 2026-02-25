import { Suspense, lazy } from 'react'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import UserLayout from '../components/layout/UserLayout'
import PageSpinner from '../components/ui/PageSpinner'
import { useAuthStore } from '../store/authStore'
import { isTokenValid } from '../utils/jwt'

const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('../pages/user/DashboardPage'))
const MenuPage = lazy(() => import('../pages/user/MenuPage'))
const CartPage = lazy(() => import('../pages/user/CartPage'))
const OrdersPage = lazy(() => import('../pages/user/OrdersPage'))
const OrderDetailPage = lazy(() => import('../pages/user/OrderDetailPage'))
const AddressesPage = lazy(() => import('../pages/user/AddressesPage'))
const BillsPage = lazy(() => import('../pages/user/BillsPage'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminDishesPage = lazy(() => import('../pages/admin/AdminDishesPage'))
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'))
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'))
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'))
const ForbiddenPage = lazy(() => import('../pages/admin/ForbiddenPage'))

const Wrap = ({ children }: { children: JSX.Element }) => <Suspense fallback={<PageSpinner />}>{children}</Suspense>

function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  return isTokenValid(token) ? <Outlet /> : <Navigate to='/login' replace />
}

function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  return user?.role === 'admin' ? <Outlet /> : <Wrap><ForbiddenPage /></Wrap>
}

export const router = createBrowserRouter([
  { path: '/login', element: <Wrap><LoginPage /></Wrap> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Navigate to='/dashboard' replace /> },
      {
        element: <UserLayout />,
        children: [
          { path: '/dashboard', element: <Wrap><DashboardPage /></Wrap> },
          { path: '/menu', element: <Wrap><MenuPage /></Wrap> },
          { path: '/cart', element: <Wrap><CartPage /></Wrap> },
          { path: '/orders', element: <Wrap><OrdersPage /></Wrap> },
          { path: '/orders/:id', element: <Wrap><OrderDetailPage /></Wrap> },
          { path: '/addresses', element: <Wrap><AddressesPage /></Wrap> },
          { path: '/bills', element: <Wrap><BillsPage /></Wrap> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin', element: <Wrap><AdminDashboard /></Wrap> },
              { path: '/admin/dishes', element: <Wrap><AdminDishesPage /></Wrap> },
              { path: '/admin/categories', element: <Wrap><AdminCategoriesPage /></Wrap> },
              { path: '/admin/orders', element: <Wrap><AdminOrdersPage /></Wrap> },
              { path: '/admin/users', element: <Wrap><AdminUsersPage /></Wrap> },
            ],
          },
        ],
      },
    ],
  },
])
