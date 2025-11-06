import { create } from "zustand";
import type { Cart } from "../types";
import type { Order } from "@/entities/Order";
import * as cartApi from "../api/cartApi";

interface CartStore {
	cart: Cart | null;
	isLoading: boolean;

	// Actions
	fetchCart: () => Promise<void>;
	addToCart: (dishId: number, quantity?: number) => Promise<void>;
	removeItem: (cartItemId: number, quantity?: number) => Promise<void>;
	clearCart: () => Promise<void>;
	checkout: () => Promise<Order>;

	// Computed getters
	getItemCount: () => number;
	getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
	cart: null,
	isLoading: false,

	fetchCart: async () => {
		set({ isLoading: true });
		try {
			const cart = await cartApi.getCart();
			set({ cart, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch cart:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	addToCart: async (dishId: number, quantity: number = 1) => {
		set({ isLoading: true });
		try {
			const cart = await cartApi.addDishToCart(dishId, quantity);
			set({ cart, isLoading: false });
		} catch (error) {
			console.error("Failed to add to cart:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	removeItem: async (cartItemId: number, quantity: number = 1) => {
		set({ isLoading: true });
		try {
			const cart = await cartApi.removeFromCart(cartItemId, quantity);
			set({ cart, isLoading: false });
		} catch (error) {
			console.error("Failed to remove from cart:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	clearCart: async () => {
		set({ isLoading: true });
		try {
			await cartApi.clearCart();
			set({ cart: null, isLoading: false });
		} catch (error) {
			console.error("Failed to clear cart:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	checkout: async () => {
		set({ isLoading: true });
		try {
			const order = await cartApi.checkout();
			// Cart is cleared on backend after checkout
			set({ cart: null, isLoading: false });
			return order;
		} catch (error) {
			console.error("Failed to checkout:", error);
			set({ isLoading: false });
			throw error;
		}
	},

	getItemCount: () => {
		const { cart } = get();
		if (!cart || !cart.cartItems) {
			return 0;
		}
		return cart.cartItems.reduce((total, item) => total + item.quantity, 0);
	},

	getTotal: () => {
		const { cart } = get();
		return cart?.total ?? 0;
	},
}));
