/**
 * Cart entity types
 * Based on CartDTO and CartItemDTO from backend
 */

export interface CartItem {
	id: number;
	dishId: number;
	quantity: number;
	price: number;
	itemTotal: number;
}

export interface Cart {
	cartId: number;
	userId: number;
	cartItems: CartItem[];
	total: number;
}