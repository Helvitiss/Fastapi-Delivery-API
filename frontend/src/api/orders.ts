import { api } from './client'
import { OrderRead } from '../types'

export const getOrders = async (): Promise<OrderRead[]> => (await api.get('/orders/')).data
export const getOrder = async (id: number): Promise<OrderRead> => (await api.get(`/orders/${id}`)).data
export const createOrder = async (address_id: number): Promise<OrderRead> => (await api.post('/orders/', { address_id })).data
