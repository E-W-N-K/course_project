/**
 * Cart entity types
 * Based on CartDTO and CartItemDTO from backend
 */

import type { Dish } from "@/entities/Dish";

export interface CartItem {
	id: number;
	dishId: number;
	dish: Dish;
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
