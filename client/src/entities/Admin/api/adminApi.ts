import { apiClient } from "@/shared/api/client";
import type { Order, OrderStatus } from "@/entities/Order";
import type { User } from "@/entities/User";

/**
 * API: Get all orders (admin only)
 * GET /admin/orders
 * Optional filters: status, userId
 */
export const getAllOrders = async (
	status?: OrderStatus,
	userId?: number,
): Promise<Order[]> => {
	const params = new URLSearchParams();
	if (status) params.append("status", status);
	if (userId !== undefined) params.append("userId", userId.toString());

	const queryString = params.toString();
	const endpoint = `/admin/orders${queryString ? `?${queryString}` : ""}`;

	return apiClient.get<Order[]>(endpoint);
};

/**
 * API: Update order status (admin only)
 * PATCH /admin/orders/{orderId}/status
 */
export const updateOrderStatus = async (
	orderId: number,
	status: OrderStatus,
): Promise<Order> => {
	return apiClient.patch<Order>(
		`/admin/orders/${orderId}/status?status=${status}`,
	);
};

/**
 * API: Get all users (admin only)
 * GET /admin/users
 */
export const getAllUsers = async (): Promise<User[]> => {
	return apiClient.get<User[]>("/admin/users");
};

/**
 * API: Delete user (admin only)
 * DELETE /admin/users/{userId}
 */
export const deleteUser = async (userId: number): Promise<void> => {
	await apiClient.delete<void>(`/admin/users/${userId}`);
};
