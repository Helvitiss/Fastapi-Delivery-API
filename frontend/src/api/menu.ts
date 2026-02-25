import api from './client';
import { DishRead, CategoryRead } from '../types';

export const menuService = {
    getDishes: async (): Promise<DishRead[]> => {
        const response = await api.get<DishRead[]>('/dishes/');
        return response.data;
    },
    getDish: async (id: number): Promise<DishRead> => {
        const response = await api.get<DishRead>(`/dishes/${id}`);
        return response.data;
    },
    getCategories: async (): Promise<CategoryRead[]> => {
        const response = await api.get<CategoryRead[]>('/category/');
        return response.data;
    },
};
