import api from './client';
import {
    DishRead, DishCreate,
    CategoryRead, CategoryUpdate, CategoryCreate,
    OrderRead, OrderStatus
} from '../types';

export const adminService = {
    // Dishes
    getDishes: async (): Promise<DishRead[]> => {
        const response = await api.get<DishRead[]>('/admin/dishes/');
        return response.data;
    },
    createDish: async (data: DishCreate): Promise<DishRead> => {
        const response = await api.post<DishRead>('/admin/dishes/', data);
        return response.data;
    },
    updateDish: async (id: number, data: Partial<DishCreate>): Promise<DishRead> => {
        const response = await api.patch<DishRead>(`/admin/dishes/${id}`, data);
        return response.data;
    },
    deleteDish: async (id: number): Promise<void> => {
        await api.delete(`/admin/dishes/${id}`);
    },
    uploadPhoto: async (id: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(`/admin/dishes/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Categories
    getCategories: async (): Promise<CategoryRead[]> => {
        const response = await api.get<CategoryRead[]>('/categories/');
        return response.data;
    },
    createCategory: async (data: CategoryCreate): Promise<CategoryRead> => {
        const response = await api.post<CategoryRead>('/admin/categories/', data);
        return response.data;
    },
    updateCategory: async (id: number, data: CategoryUpdate): Promise<CategoryRead> => {
        const response = await api.patch<CategoryRead>(`/admin/categories/${id}`, data);
        return response.data;
    },
    deleteCategory: async (id: number): Promise<void> => {
        await api.delete(`/admin/categories/${id}`);
    },

    // Orders
    getOrders: async (): Promise<OrderRead[]> => {
        const response = await api.get<OrderRead[]>('/admin/orders/');
        return response.data;
    },
    getOrder: async (id: number): Promise<OrderRead> => {
        const response = await api.get<OrderRead>(`/admin/orders/${id}`);
        return response.data;
    },
    updateOrderStatus: async (id: number, status: OrderStatus): Promise<void> => {
        await api.patch(`/admin/orders/${id}/status`, { status });
    },
};
