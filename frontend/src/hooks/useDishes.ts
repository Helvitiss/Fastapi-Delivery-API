import { useQuery } from '@tanstack/react-query'
import { getDishes } from '../api/menu'
import { queryKeys } from '../api/queryKeys'

export const useDishes = () => useQuery({ queryKey: queryKeys.dishes.all, queryFn: getDishes })
