export type OrderStatus = 'new' | 'confirmed' | 'cooking' | 'delivering' | 'completed' | 'cancelled'

export interface CategoryRead { id: number; name: string; description?: string | null }
export interface DishRead {
  id: number
  name: string
  price: number
  weight?: number | null
  description?: string | null
  is_available: boolean
  category_id: number
  image_url?: string | null
}
export interface CartItemWithDish { dish: DishRead; quantity: number; total_dish_price: number }
export interface CartWithItemsResponse { cart_id: number; total_price: number; items: CartItemWithDish[] }
export interface OrderItemRead { id: number; dish_id: number; dish_name: string; price: number; quantity: number }
export interface OrderRead {
  id: number
  user_id: number
  address_id: number
  total_price: number
  status: OrderStatus
  comment?: string | null
  created_at: string
  items: OrderItemRead[]
}
export interface AddressResponse { id: number; address: string; user_id: number }
export interface UserRead { id: number; name?: string | null; phone: string; role: 'user' | 'admin' }
export interface TokenResponse { access_token: string; token_type: string }
export interface JWTPayload { sub: string; exp: number; role?: 'user' | 'admin' }
