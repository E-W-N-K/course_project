import { apiClient } from "@/shared/api/client";
import type { Order, OrderStatus } from "../types";

/**
 * API: Get all orders for current user
 * GET /orders
 * User is identified from JWT cookie automatically
 * Returns orders sorted by orderTime (newest first)
 */
export const getAllOrders = async (): Promise<Order[]> => {
	return apiClient.get<Order[]>("/orders");
};

/**
 * API: Get specific order by ID
 * GET /orders/{orderId}
 * Verifies order belongs to current user
 */
export const getOrderById = async (orderId: number): Promise<Order> => {
	return apiClient.get<Order>(`/orders/${orderId}`);
};

/**
 * API: Get orders by status
 * GET /orders/status/{status}
 * Filter user's orders by status (PENDING, COMPLETED, CANCELLED)
 */
export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
	return apiClient.get<Order[]>(`/orders/status/${status}`);
};

/**
 * API: Cancel order
 * PUT /orders/{orderId}/cancel
 * Can only cancel orders in PENDING status
 */
export const cancelOrder = async (orderId: number): Promise<Order> => {
	return apiClient.put<Order>(`/orders/${orderId}/cancel`);
};

/**
 * API: Get order history
 * GET /orders/history
 * Returns all orders sorted by orderTime (newest first)
 */
export const getOrderHistory = async (): Promise<Order[]> => {
	return apiClient.get<Order[]>("/orders/history");
};

/**
 * Legacy function - kept for backward compatibility
 * Use getAllOrders() instead
 */
export const getUserOrders = async (): Promise<Order[]> => {
	return getAllOrders();
};
