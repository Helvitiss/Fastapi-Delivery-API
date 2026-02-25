export type OrderStatus =
    | 'new'
    | 'confirmed'
    | 'cooking'
    | 'delivering'
    | 'completed'
    | 'cancelled';

export type UserRole = 'user' | 'admin';

export interface CategoryRead {
    id: number;
    name: string;
    description?: string;
}

export interface CategoryCreate {
    name: string;
    description?: string;
}

export interface CategoryUpdate {
    name?: string;
    description?: string;
}

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

export interface CartItemRead {
    id: number;
    dish_id: number;
    quantity: number;
}

export interface CartItemWithDish {
    dish: DishRead;
    quantity: number;
    total_dish_price: number;
}

export interface CartWithItemsResponse {
    cart_id: number;
    total_price: number;
    items: CartItemWithDish[];
}

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
    role: string;
    created_at?: string | null;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface JWTPayload {
    sub: string;
    role: UserRole;
    exp: number;
}

// Schemas for POST/PATCH
export interface OTPRequest {
    phone_number: string;
}

export interface OTPVerifyRequest {
    phone_number: string;
    code: string;
}

export interface OTPSentResponse {
    phone_number: string;
    expires_in_seconds: number;
}

export interface DishCreate {
    name: string;
    price: number;
    category_id: number;
    weight?: number;
    description?: string;
    is_available?: boolean;
}

export interface AddressCreate {
    address: string;
}

