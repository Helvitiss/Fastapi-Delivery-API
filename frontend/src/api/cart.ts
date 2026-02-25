import api from './client';
import { CartWithItemsResponse, CartItemRead } from '../types';

export const cartService = {
    getCart: async (): Promise<CartWithItemsResponse> => {
        const response = await api.get<CartWithItemsResponse>('/cart/');
        return response.data;
    },
    addItem: async (dish_id: number, quantity: number): Promise<CartItemRead> => {
        const response = await api.post<CartItemRead>('/cart/items', { dish_id, quantity });
        return response.data;
    },
    updateItem: async (dish_id: number, quantity: number): Promise<void> => {
        await api.patch('/cart/items', { dish_id, quantity });
    },
    removeItem: async (dish_id: number): Promise<void> => {
        await api.delete(`/cart/items/${dish_id}`);
    },
    clearCart: async (): Promise<void> => {
        await api.delete('/cart/');
    },
};
