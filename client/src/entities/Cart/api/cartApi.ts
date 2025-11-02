import type { Cart, CartItem } from "../types";
import type { Order } from "@/entities/Order";
import { orderApi } from "@/entities/Order";
import { dishApi } from "@/entities/Dish";

const CART_KEY = "food_delivery_cart";

// Simulate network delay
const delay = (ms: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Storage structure: { userId: Cart }
 * Each user has their own cart
 */
interface CartStorage {
	[userId: number]: Cart;
}

/**
 * Get all carts from localStorage
 */
const getCarts = (): CartStorage => {
	const stored = localStorage.getItem(CART_KEY);
	if (stored) {
		return JSON.parse(stored);
	}
	return {};
};

/**
 * Save all carts to localStorage
 */
const saveCarts = (carts: CartStorage): void => {
	localStorage.setItem(CART_KEY, JSON.stringify(carts));
};

/**
 * Get or create cart for specific user
 */
const getUserCart = (userId: number): Cart => {
	const carts = getCarts();

	if (!carts[userId]) {
		// Create new empty cart for user
		const newCart: Cart = {
			cartId: userId, // Use userId as cartId for simplicity
			userId,
			cartItems: [],
			total: 0,
		};
		carts[userId] = newCart;
		saveCarts(carts);
		return newCart;
	}

	return carts[userId];
};

/**
 * Save user's cart
 */
const saveUserCart = (userId: number, cart: Cart): void => {
	const carts = getCarts();
	carts[userId] = cart;
	saveCarts(carts);
};

/**
 * Calculate cart total
 */
const calculateTotal = (cartItems: CartItem[]): number => {
	return cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
};

/**
 * API: Get current user's cart
 * Matches: GET /cart
 */
export const getCart = async (userId: number): Promise<Cart> => {
	await delay();
	return getUserCart(userId);
};

/**
 * API: Add dish to cart
 * Matches: POST /cart/add/{dishId}?quantity={quantity}
 * If dish already in cart, increment quantity. Otherwise, create new cart item.
 */
export const addDishToCart = async (
	userId: number,
	dishId: number,
	quantity: number = 1,
): Promise<Cart> => {
	await delay();

	if (quantity <= 0) {
		throw new Error("Quantity must be positive");
	}

	// Get user's cart
	const cart = getUserCart(userId);

	// Get dish details to get current price
	const dish = await dishApi.getAllDishes().then((dishes) => {
		const found = dishes.find((d) => d.id === dishId);
		if (!found) {
			throw new Error(`Dish with id ${dishId} not found`);
		}
		return found;
	});

	// Check if dish already in cart
	const existingItemIndex = cart.cartItems.findIndex(
		(item) => item.dishId === dishId,
	);

	if (existingItemIndex >= 0) {
		// Increment quantity
		const existingItem = cart.cartItems[existingItemIndex];
		existingItem.quantity += quantity;
		existingItem.itemTotal = existingItem.quantity * existingItem.price;
	} else {
		// Create new cart item
		// Generate unique ID for cart item (max existing ID + 1)
		const existingIds = cart.cartItems.map((item) => item.id);
		const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

		const newItem: CartItem = {
			id: newId,
			dishId: dish.id,
			quantity,
			price: dish.price,
			itemTotal: quantity * dish.price,
		};

		cart.cartItems.push(newItem);
	}

	// Recalculate total
	cart.total = calculateTotal(cart.cartItems);

	// Save cart
	saveUserCart(userId, cart);

	return cart;
};

/**
 * API: Remove or decrease item from cart
 * Matches: DELETE /cart/remove/{cartItemId}?quantity={quantity}
 * If quantity to remove >= current quantity, delete item. Otherwise, decrement.
 */
export const removeFromCart = async (
	userId: number,
	cartItemId: number,
	quantity: number = 1,
): Promise<Cart> => {
	await delay();

	if (quantity <= 0) {
		throw new Error("Quantity must be positive");
	}

	// Get user's cart
	const cart = getUserCart(userId);

	// Find cart item
	const itemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);

	if (itemIndex === -1) {
		throw new Error(`Cart item with id ${cartItemId} not found`);
	}

	const item = cart.cartItems[itemIndex];

	if (quantity >= item.quantity) {
		// Remove item completely
		cart.cartItems.splice(itemIndex, 1);
	} else {
		// Decrease quantity
		item.quantity -= quantity;
		item.itemTotal = item.quantity * item.price;
	}

	// Recalculate total
	cart.total = calculateTotal(cart.cartItems);

	// Save cart
	saveUserCart(userId, cart);

	return cart;
};

/**
 * API: Clear entire cart
 * Matches: DELETE /cart/clear
 */
export const clearCart = async (userId: number): Promise<void> => {
	await delay();

	const cart = getUserCart(userId);
	cart.cartItems = [];
	cart.total = 0;

	saveUserCart(userId, cart);
};

/**
 * API: Checkout - convert cart to order and clear cart
 * Matches: POST /cart/checkout
 * Creates an order from cart items, then clears the cart
 */
export const checkout = async (userId: number): Promise<Order> => {
	await delay();

	// Get user's cart
	const cart = getUserCart(userId);

	if (cart.cartItems.length === 0) {
		throw new Error("Cannot checkout with empty cart");
	}

	// Convert cart items to order items (without IDs, orderApi will generate them)
	const orderItems = cart.cartItems.map((cartItem) => ({
		dishId: cartItem.dishId,
		quantity: cartItem.quantity,
		priceAtOrder: cartItem.price,
		itemTotal: cartItem.itemTotal,
	}));

	// Create order
	const order = await orderApi.createOrder(userId, orderItems);

	// Clear cart after successful checkout
	cart.cartItems = [];
	cart.total = 0;
	saveUserCart(userId, cart);

	return order;
};
