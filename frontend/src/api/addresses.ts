import { api } from './client'
import { AddressResponse } from '../types'

export const getAddresses = async (): Promise<AddressResponse[]> => (await api.get('/address/')).data
export const createAddress = async (address: string): Promise<AddressResponse> => (await api.post('/address/', { address })).data
export const deleteAddress = async (id: number) => (await api.delete(`/address/${id}`)).data
