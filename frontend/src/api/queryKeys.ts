export const queryKeys = {
  dishes: { all: ['dishes'] as const, detail: (id: number) => ['dishes', id] as const },
  categories: { all: ['categories'] as const },
  cart: ['cart'] as const,
  orders: { all: ['orders'] as const, detail: (id: number) => ['orders', id] as const },
  addresses: ['addresses'] as const,
  admin: {
    dishes: ['admin', 'dishes'] as const,
    categories: ['admin', 'categories'] as const,
    orders: ['admin', 'orders'] as const,
    users: ['admin', 'users'] as const,
  },
}
