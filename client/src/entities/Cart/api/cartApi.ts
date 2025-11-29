import { apiClient } from "@/shared/api/client";
import type { Cart } from "../types";
import type { Order } from "@/entities/Order";

/**
 * API: Get current user's cart
 * GET /cart
 * User is identified from JWT cookie automatically
 */
export const getCart = async (): Promise<Cart> => {
	return apiClient.get<Cart>("/cart");
};

/**
 * API: Add dish to cart
 * POST /cart/add/{dishId}?quantity={quantity}
 * User is identified from JWT cookie automatically
 */
export const addDishToCart = async (
	dishId: number,
	quantity: number = 1,
): Promise<Cart> => {
	return apiClient.post<Cart>(`/cart/add/${dishId}?quantity=${quantity}`);
};

/**
 * API: Remove or decrease item from cart
 * DELETE /cart/remove/{cartItemId}?quantity={quantity}
 * If quantity to remove >= current quantity, item is deleted completely
 */
export const removeFromCart = async (
	cartItemId: number,
	quantity: number = 1,
): Promise<Cart> => {
	return apiClient.delete<Cart>(
		`/cart/remove/${cartItemId}?quantity=${quantity}`,
	);
};

/**
 * API: Clear entire cart
 * DELETE /cart/clear
 */
export const clearCart = async (): Promise<void> => {
	await apiClient.delete<void>("/cart/clear");
};

/**
 * API: Checkout - convert cart to order and clear cart
 * POST /cart/checkout
 * Creates an order from cart items, then clears the cart
 */
export const checkout = async (): Promise<Order> => {
	return apiClient.post<Order>("/cart/checkout");
};
