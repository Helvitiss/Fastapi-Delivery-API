import { api } from './client'
import { CartWithItemsResponse } from '../types'

export const getCart = async (): Promise<CartWithItemsResponse> => (await api.get('/cart/')).data
export const addItem = async (dish_id: number, quantity: number) => (await api.post('/cart/items', { dish_id, quantity })).data
export const updateItem = async (dish_id: number, quantity: number) => (await api.patch('/cart/items', { dish_id, quantity })).data
export const removeItem = async (dish_id: number) => (await api.delete(`/cart/items/${dish_id}`)).data
export const clearCart = async () => (await api.delete('/cart/')).data
