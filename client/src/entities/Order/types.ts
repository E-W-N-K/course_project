/**
 * Order entity types
 * Based on OrderDTO, OrderItemDTO, and OrderStatus from backend
 */

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
	id: number;
	dishId: number;
	dishName: string;
	quantity: number;
	priceAtOrder: number;
	itemTotal: number;
}

export interface Order {
	orderId: number;
	userId: number;
	orderItems: OrderItem[];
	orderTime: string; // ISO 8601 date-time string
	status: OrderStatus;
	total: number;
}
