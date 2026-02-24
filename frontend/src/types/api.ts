export interface DishRead {
  id: number;
  name: string;
  price: number;
  weight?: number;
  description?: string;
  is_available: boolean;
  category_id: number;
  image_url?: string;
}

export interface CategoryRead {
  id: number;
  name: string;
  description?: string;
}

export interface CartItemPayload {
  dish_id: number;
  quantity: number;
}

export interface CartWithItemsResponse {
  cart_id: number;
  total_price: number;
  items: {
    dish: DishRead;
    quantity: number;
    total_dish_price: number;
  }[];
}

export type OrderStatus = 'new' | 'confirmed' | 'cooking' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItemRead {
  id: number;
  dish_id: number;
  dish_name: string;
  price: number;
  quantity: number;
}

export interface OrderRead {
  id: number;
  user_id: number;
  address_id: number;
  total_price: number;
  status: OrderStatus;
  comment?: string;
  created_at: string;
  items: OrderItemRead[];
}

export interface AddressResponse {
  id: number;
  address: string;
  user_id: number;
}

export interface UserRead {
  id: number;
  phone_number: string;
  is_admin: boolean;
}

export interface AuthRequestCodeResponse {
  phone_number: string;
  expires_in_seconds: number;
}

export interface AuthLoginResponse {
  access_token: string;
  token_type: 'bearer';
}
