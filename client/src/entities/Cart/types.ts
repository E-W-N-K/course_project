/**
 * Cart entity types
 * Based on CartDTO and CartItemDTO from backend
 */

export interface CartItem {
	id: number;
	dishId: number;
	restaurantId: number; // Added to support fetching dish details
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