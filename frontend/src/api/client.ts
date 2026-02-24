import { axiosInstance } from '../lib/axiosInstance';
import type {
  AddressResponse,
  AuthLoginResponse,
  AuthRequestCodeResponse,
  CartItemPayload,
  CartWithItemsResponse,
  CategoryRead,
  DishRead,
  OrderRead,
  UserRead,
  OrderStatus,
} from '../types/api';

export const authApi = {
  requestCode: (phone_number: string) =>
    axiosInstance.post<AuthRequestCodeResponse>('/auth/request-code', { phone_number }).then((r) => r.data),
  login: (phone_number: string, code: string) =>
    axiosInstance.post<AuthLoginResponse>('/auth/login', { phone_number, code }).then((r) => r.data),
};

export const menuApi = {
  getDishes: () => axiosInstance.get<DishRead[]>('/dishes/').then((r) => r.data),
  getDish: (id: number) => axiosInstance.get<DishRead>(`/dishes/${id}`).then((r) => r.data),
  getCategories: () => axiosInstance.get<CategoryRead[]>('/categories/').then((r) => r.data),
};

export const cartApi = {
  getCart: () => axiosInstance.get<CartWithItemsResponse>('/cart/').then((r) => r.data),
  addItem: (payload: CartItemPayload) => axiosInstance.post('/cart/items', payload),
  updateItem: (payload: CartItemPayload) => axiosInstance.patch('/cart/items', payload),
  removeItem: (dishId: number) => axiosInstance.delete(`/cart/items/${dishId}`),
  clear: () => axiosInstance.delete('/cart/'),
};

export const ordersApi = {
  list: () => axiosInstance.get<OrderRead[]>('/orders/').then((r) => r.data),
  getById: (id: number) => axiosInstance.get<OrderRead>(`/orders/${id}`).then((r) => r.data),
  create: (address_id: number) => axiosInstance.post<OrderRead>('/orders/', { address_id }).then((r) => r.data),
};

export const addressApi = {
  list: () => axiosInstance.get<AddressResponse[]>('/address/').then((r) => r.data),
  create: (address: string) => axiosInstance.post<AddressResponse>('/address/', { address }).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/address/${id}`),
};

export const adminApi = {
  dishes: {
    list: () => axiosInstance.get<DishRead[]>('/admin/dishes/').then((r) => r.data),
    create: (payload: Omit<DishRead, 'id' | 'image_url'>) => axiosInstance.post<DishRead>('/admin/dishes/', payload).then((r) => r.data),
    update: (id: number, payload: Partial<DishRead>) => axiosInstance.patch<DishRead>(`/admin/dishes/${id}`, payload).then((r) => r.data),
    remove: (id: number) => axiosInstance.delete(`/admin/dishes/${id}`),
    uploadPhoto: (id: number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return axiosInstance.post<{ image_url: string }>(`/admin/dishes/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data);
    },
  },
  categories: {
    list: () => axiosInstance.get<CategoryRead[]>('/admin/categories/').then((r) => r.data),
    create: (payload: Omit<CategoryRead, 'id'>) => axiosInstance.post<CategoryRead>('/admin/categories/', payload).then((r) => r.data),
    update: (id: number, payload: Partial<CategoryRead>) => axiosInstance.patch<CategoryRead>(`/admin/categories/${id}`, payload).then((r) => r.data),
    remove: (id: number) => axiosInstance.delete(`/admin/categories/${id}`),
  },
  orders: {
    list: () => axiosInstance.get<OrderRead[]>('/admin/orders/').then((r) => r.data),
    getById: (id: number) => axiosInstance.get<OrderRead>(`/admin/orders/${id}`).then((r) => r.data),
    updateStatus: (id: number, status: OrderStatus) =>
      axiosInstance.patch<OrderRead>(`/admin/orders/${id}/status`, { status }).then((r) => r.data),
  },
  users: {
    list: () => axiosInstance.get<UserRead[]>('/admin/users/').then((r) => r.data),
    getById: (id: number) => axiosInstance.get<UserRead>(`/admin/users/${id}`).then((r) => r.data),
    me: () => axiosInstance.get<UserRead>('/admin/users/me').then((r) => r.data),
  },
};
