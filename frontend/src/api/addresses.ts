import api from './client';
import { AddressResponse, AddressCreate } from '../types';

export const addressService = {
    getAddresses: async (): Promise<AddressResponse[]> => {
        const response = await api.get<AddressResponse[]>('/address/');
        return response.data;
    },
    createAddress: async (data: AddressCreate): Promise<AddressResponse> => {
        const response = await api.post<AddressResponse>('/address/', data);
        return response.data;
    },
    deleteAddress: async (id: number): Promise<void> => {
        await api.delete(`/address/${id}`);
    },
};
