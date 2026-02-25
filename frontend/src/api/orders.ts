import api from './client';
import { OrderRead } from '../types';

export const ordersService = {
    getOrders: async (): Promise<OrderRead[]> => {
        const response = await api.get<OrderRead[]>('/orders/');
        return response.data;
    },
    getOrder: async (id: number): Promise<OrderRead> => {
        const response = await api.get<OrderRead>(`/orders/${id}`);
        return response.data;
    },
    createOrder: async (address_id: number): Promise<OrderRead> => {
        const response = await api.post<OrderRead>('/orders/', { address_id });
        return response.data;
    },
};
