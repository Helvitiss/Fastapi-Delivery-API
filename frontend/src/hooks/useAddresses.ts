import { useQuery } from '@tanstack/react-query'
import { getAddresses } from '../api/addresses'
import { queryKeys } from '../api/queryKeys'

export const useAddresses = () => useQuery({ queryKey: queryKeys.addresses, queryFn: getAddresses })
