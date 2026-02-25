import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/orders'
import { queryKeys } from '../api/queryKeys'

export const useOrders = () => useQuery({ queryKey: queryKeys.orders.all, queryFn: getOrders })
