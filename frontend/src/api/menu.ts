import { api } from './client'
import { CategoryRead, DishRead } from '../types'

export const getDishes = async (): Promise<DishRead[]> => (await api.get('/dishes/')).data
export const getDish = async (id: number): Promise<DishRead> => (await api.get(`/dishes/${id}`)).data
export const getCategories = async (): Promise<CategoryRead[]> => (await api.get('/categories/')).data
