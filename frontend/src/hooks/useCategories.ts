import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/menu'
import { queryKeys } from '../api/queryKeys'

export const useCategories = () => useQuery({ queryKey: queryKeys.categories.all, queryFn: getCategories })
