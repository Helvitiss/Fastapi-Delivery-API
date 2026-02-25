import { api } from './client'
import { CategoryRead, DishRead, OrderRead, OrderStatus, UserRead } from '../types'

export type DishCreate = Omit<DishRead, 'id' | 'image_url'>
export type DishUpdate = Partial<DishCreate>

export const adminGetDishes = async (): Promise<DishRead[]> => (await api.get('/admin/dishes/')).data
export const adminCreateDish = async (data: DishCreate): Promise<DishRead> => (await api.post('/admin/dishes/', data)).data
export const adminUpdateDish = async (id: number, data: DishUpdate): Promise<DishRead> => (await api.patch(`/admin/dishes/${id}`, data)).data
export const adminDeleteDish = async (id: number) => (await api.delete(`/admin/dishes/${id}`)).data
export const adminUploadPhoto = async (id: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return (await api.post(`/admin/dishes/${id}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data
}

export const adminGetCategories = async (): Promise<CategoryRead[]> => (await api.get('/admin/categories/')).data
export const adminCreateCategory = async (data: Pick<CategoryRead, 'name' | 'description'>): Promise<CategoryRead> =>
  (await api.post('/admin/categories/', data)).data
export const adminUpdateCategory = async (id: number, data: Pick<CategoryRead, 'name' | 'description'>): Promise<CategoryRead> =>
  (await api.patch(`/admin/categories/${id}`, data)).data
export const adminDeleteCategory = async (id: number) => (await api.delete(`/admin/categories/${id}`)).data

export const adminGetOrders = async (): Promise<OrderRead[]> => (await api.get('/admin/orders/')).data
export const adminGetOrder = async (id: number): Promise<OrderRead> => (await api.get(`/admin/orders/${id}`)).data
export const adminUpdateOrderStatus = async (id: number, status: OrderStatus): Promise<OrderRead> =>
  (await api.patch(`/admin/orders/${id}/status`, { status })).data

export const adminGetUsers = async (): Promise<UserRead[]> => []
export const adminGetUser = async () => null
