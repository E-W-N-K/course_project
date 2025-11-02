import type { Order, OrderItem } from "../types";

const ORDERS_KEY = "food_delivery_orders";

// Simulate network delay
const delay = (ms: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Initialize default mock orders
 * Orders for different users with various statuses
 */
const getDefaultOrders = (): Order[] => {
	return [
		// User 1 (admin) - Recent completed order
		{
			orderId: 1,
			userId: 1,
			orderItems: [
				{
					id: 1,
					dishId: 1,
					quantity: 2,
					priceAtOrder: 14.99,
					itemTotal: 29.98,
				},
				{
					id: 2,
					dishId: 6,
					quantity: 1,
					priceAtOrder: 8.99,
					itemTotal: 8.99,
				},
			],
			orderTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
			status: "COMPLETED",
			total: 38.97,
		},

		// User 2 (alice) - Pending order
		{
			orderId: 2,
			userId: 2,
			orderItems: [
				{
					id: 3,
					dishId: 12,
					quantity: 1,
					priceAtOrder: 12.99,
					itemTotal: 12.99,
				},
				{
					id: 4,
					dishId: 13,
					quantity: 1,
					priceAtOrder: 14.99,
					itemTotal: 14.99,
				},
				{
					id: 5,
					dishId: 16,
					quantity: 2,
					priceAtOrder: 4.99,
					itemTotal: 9.98,
				},
			],
			orderTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
			status: "PENDING",
			total: 37.96,
		},

		// User 3 (bob) - Completed order
		{
			orderId: 3,
			userId: 3,
			orderItems: [
				{
					id: 6,
					dishId: 26,
					quantity: 1,
					priceAtOrder: 12.99,
					itemTotal: 12.99,
				},
				{
					id: 7,
					dishId: 30,
					quantity: 1,
					priceAtOrder: 5.99,
					itemTotal: 5.99,
				},
			],
			orderTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
			status: "COMPLETED",
			total: 18.98,
		},

		// User 2 (alice) - Another completed order
		{
			orderId: 4,
			userId: 2,
			orderItems: [
				{
					id: 8,
					dishId: 39,
					quantity: 2,
					priceAtOrder: 11.99,
					itemTotal: 23.98,
				},
				{
					id: 9,
					dishId: 42,
					quantity: 1,
					priceAtOrder: 8.99,
					itemTotal: 8.99,
				},
			],
			orderTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
			status: "COMPLETED",
			total: 32.97,
		},

		// User 1 (admin) - Pending order
		{
			orderId: 5,
			userId: 1,
			orderItems: [
				{
					id: 10,
					dishId: 32,
					quantity: 1,
					priceAtOrder: 19.99,
					itemTotal: 19.99,
				},
				{
					id: 11,
					dishId: 33,
					quantity: 1,
					priceAtOrder: 22.99,
					itemTotal: 22.99,
				},
				{
					id: 12,
					dishId: 36,
					quantity: 2,
					priceAtOrder: 7.99,
					itemTotal: 15.98,
				},
			],
			orderTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
			status: "PENDING",
			total: 58.96,
		},

		// User 3 (bob) - Cancelled order
		{
			orderId: 6,
			userId: 3,
			orderItems: [
				{
					id: 13,
					dishId: 51,
					quantity: 1,
					priceAtOrder: 15.99,
					itemTotal: 15.99,
				},
			],
			orderTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
			status: "CANCELLED",
			total: 15.99,
		},

		// User 2 (alice) - Completed order
		{
			orderId: 7,
			userId: 2,
			orderItems: [
				{
					id: 14,
					dishId: 19,
					quantity: 2,
					priceAtOrder: 13.99,
					itemTotal: 27.98,
				},
				{
					id: 15,
					dishId: 22,
					quantity: 1,
					priceAtOrder: 10.99,
					itemTotal: 10.99,
				},
				{
					id: 16,
					dishId: 23,
					quantity: 1,
					priceAtOrder: 6.99,
					itemTotal: 6.99,
				},
			],
			orderTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
			status: "COMPLETED",
			total: 45.96,
		},

		// User 1 (admin) - Completed order
		{
			orderId: 8,
			userId: 1,
			orderItems: [
				{
					id: 17,
					dishId: 7,
					quantity: 1,
					priceAtOrder: 18.99,
					itemTotal: 18.99,
				},
				{
					id: 18,
					dishId: 8,
					quantity: 1,
					priceAtOrder: 28.99,
					itemTotal: 28.99,
				},
				{
					id: 19,
					dishId: 11,
					quantity: 1,
					priceAtOrder: 7.99,
					itemTotal: 7.99,
				},
			],
			orderTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
			status: "COMPLETED",
			total: 55.97,
		},

		// User 3 (bob) - Pending order
		{
			orderId: 9,
			userId: 3,
			orderItems: [
				{
					id: 20,
					dishId: 45,
					quantity: 1,
					priceAtOrder: 13.99,
					itemTotal: 13.99,
				},
				{
					id: 21,
					dishId: 49,
					quantity: 1,
					priceAtOrder: 5.99,
					itemTotal: 5.99,
				},
			],
			orderTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
			status: "PENDING",
			total: 19.98,
		},

		// User 2 (alice) - Completed order
		{
			orderId: 10,
			userId: 2,
			orderItems: [
				{
					id: 22,
					dishId: 58,
					quantity: 2,
					priceAtOrder: 12.99,
					itemTotal: 25.98,
				},
				{
					id: 23,
					dishId: 61,
					quantity: 1,
					priceAtOrder: 8.99,
					itemTotal: 8.99,
				},
				{
					id: 24,
					dishId: 62,
					quantity: 1,
					priceAtOrder: 9.99,
					itemTotal: 9.99,
				},
			],
			orderTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
			status: "COMPLETED",
			total: 44.96,
		},

		// User 1 (admin) - Cancelled order
		{
			orderId: 11,
			userId: 1,
			orderItems: [
				{
					id: 25,
					dishId: 27,
					quantity: 1,
					priceAtOrder: 14.99,
					itemTotal: 14.99,
				},
			],
			orderTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
			status: "CANCELLED",
			total: 14.99,
		},

		// User 3 (bob) - Completed order
		{
			orderId: 12,
			userId: 3,
			orderItems: [
				{
					id: 26,
					dishId: 14,
					quantity: 3,
					priceAtOrder: 11.99,
					itemTotal: 35.97,
				},
				{
					id: 27,
					dishId: 17,
					quantity: 1,
					priceAtOrder: 5.99,
					itemTotal: 5.99,
				},
			],
			orderTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
			status: "COMPLETED",
			total: 41.96,
		},
	];
};

/**
 * Get all orders from localStorage or initialize with defaults
 */
const getOrders = (): Order[] => {
	const stored = localStorage.getItem(ORDERS_KEY);
	if (stored) {
		return JSON.parse(stored);
	}

	const defaultOrders = getDefaultOrders();
	localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
	return defaultOrders;
};

/**
 * Save orders to localStorage
 */
const saveOrders = (orders: Order[]): void => {
	localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

/**
 * API: Get all orders (admin only)
 * Returns all orders sorted by orderTime (newest first)
 */
export const getAllOrders = async (): Promise<Order[]> => {
	await delay();
	const orders = getOrders();
	return orders.sort(
		(a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime(),
	);
};

/**
 * API: Get orders for specific user
 * Returns user's orders sorted by orderTime (newest first)
 */
export const getUserOrders = async (userId: number): Promise<Order[]> => {
	await delay();
	const orders = getOrders();
	return orders
		.filter((order) => order.userId === userId)
		.sort(
			(a, b) =>
				new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime(),
		);
};

/**
 * API: Update order status (admin only)
 * For future implementation
 */
export const updateOrderStatus = async (
	orderId: number,
	status: "PENDING" | "COMPLETED" | "CANCELLED",
): Promise<Order | null> => {
	await delay();
	const orders = getOrders();
	const orderIndex = orders.findIndex((o) => o.orderId === orderId);

	if (orderIndex === -1) {
		return null;
	}

	orders[orderIndex] = {
		...orders[orderIndex],
		status,
	};

	saveOrders(orders);
	return orders[orderIndex];
};

/**
 * API: Delete order (admin only)
 * For future implementation
 */
export const deleteOrder = async (orderId: number): Promise<boolean> => {
	await delay();
	const orders = getOrders();
	const filteredOrders = orders.filter((o) => o.orderId !== orderId);

	if (filteredOrders.length === orders.length) {
		return false; // Order not found
	}

	saveOrders(filteredOrders);
	return true;
};

/**
 * API: Create new order
 * For future implementation
 */
export const createOrder = async (
	userId: number,
	orderItems: Omit<OrderItem, "id">[],
): Promise<Order> => {
	await delay();
	const orders = getOrders();

	// Generate new IDs
	const newOrderId =
		orders.length > 0 ? Math.max(...orders.map((o) => o.orderId)) + 1 : 1;
	const existingItemIds = orders.flatMap((o) => o.orderItems.map((i) => i.id));
	const maxItemId = existingItemIds.length > 0 ? Math.max(...existingItemIds) : 0;

	// Create order items with IDs
	const itemsWithIds: OrderItem[] = orderItems.map((item, index) => ({
		...item,
		id: maxItemId + index + 1,
	}));

	// Calculate total
	const total = itemsWithIds.reduce((sum, item) => sum + item.itemTotal, 0);

	// Create new order
	const newOrder: Order = {
		orderId: newOrderId,
		userId,
		orderItems: itemsWithIds,
		orderTime: new Date().toISOString(),
		status: "PENDING",
		total,
	};

	orders.push(newOrder);
	saveOrders(orders);

	return newOrder;
};
