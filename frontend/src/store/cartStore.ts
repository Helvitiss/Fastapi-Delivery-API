import { create } from 'zustand';

interface CartUiState {
  pendingDishId: number | null;
  setPendingDishId: (dishId: number | null) => void;
}

export const useCartStore = create<CartUiState>((set) => ({
  pendingDishId: null,
  setPendingDishId: (pendingDishId) => set({ pendingDishId }),
}));
