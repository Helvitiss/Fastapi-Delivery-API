import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../api/cart';
import { queryKeys } from '../api/queryKeys';
import { useAuth } from './useAuth';

export const useCart = () => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const cartQuery = useQuery({
        queryKey: queryKeys.cart,
        queryFn: cartService.getCart,
        enabled: isAuthenticated,
    });

    const addItemMutation = useMutation({
        mutationFn: ({ dishId, quantity }: { dishId: number; quantity: number }) =>
            cartService.addItem(dishId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cart });
        },
    });

    const updateItemMutation = useMutation({
        mutationFn: ({ dishId, quantity }: { dishId: number; quantity: number }) =>
            cartService.updateItem(dishId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cart });
        },
    });

    const removeItemMutation = useMutation({
        mutationFn: (dishId: number) => cartService.removeItem(dishId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cart });
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: cartService.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cart });
        },
    });

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        addItem: addItemMutation.mutate,
        updateItem: updateItemMutation.mutate,
        removeItem: removeItemMutation.mutate,
        clearCart: clearCartMutation.mutate,
        isAdding: addItemMutation.isPending,
    };
};
