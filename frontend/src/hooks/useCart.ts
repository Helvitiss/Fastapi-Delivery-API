import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addItem, getCart, removeItem, updateItem } from '../api/cart'
import { queryKeys } from '../api/queryKeys'
import { CartWithItemsResponse } from '../types'

export const useCart = () => {
  const queryClient = useQueryClient()
  const cartQuery = useQuery({ queryKey: queryKeys.cart, queryFn: getCart })

  const updateMutation = useMutation({
    mutationFn: ({ dish_id, quantity }: { dish_id: number; quantity: number }) => updateItem(dish_id, quantity),
    onMutate: async ({ dish_id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart })
      const previousCart = queryClient.getQueryData<CartWithItemsResponse>(queryKeys.cart)
      if (previousCart) {
        queryClient.setQueryData(queryKeys.cart, {
          ...previousCart,
          items: previousCart.items.map((i) => (i.dish.id === dish_id ? { ...i, quantity } : i)),
        })
      }
      return { previousCart }
    },
    onError: (_e, _v, context) => context?.previousCart && queryClient.setQueryData(queryKeys.cart, context.previousCart),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart }),
  })

  return {
    ...cartQuery,
    addItem: useMutation({ mutationFn: ({ dish_id, quantity }: { dish_id: number; quantity: number }) => addItem(dish_id, quantity), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart }) }),
    removeItem: useMutation({ mutationFn: (dish_id: number) => removeItem(dish_id), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart }) }),
    updateItem: updateMutation,
  }
}
