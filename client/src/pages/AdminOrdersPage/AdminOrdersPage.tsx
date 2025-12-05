import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/entities/Admin";
import type { Order, OrderStatus } from "@/entities/Order";
import { useNotificationStore } from "@/shared/model";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UITable } from "@/shared/ui/UITable";
import type { UITableColumn } from "@/shared/ui/UITable";
import { UISelect } from "@/shared/ui/UISelect";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UIBadge } from "@/shared/ui/UIBadge";
import { UIFlex } from "@/shared/ui/UIFlex";
import styles from "./AdminOrdersPage.module.css";
import { UISection } from "@/shared/ui";

const STATUS_OPTIONS = [
	{ value: "PENDING", label: "Pending" },
	{ value: "COMPLETED", label: "Completed" },
	{ value: "CANCELLED", label: "Cancelled" },
];

type FilterStatus = "ALL" | OrderStatus;

export const AdminOrdersPage = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<FilterStatus>("ALL");
	const showNotification = useNotificationStore(
		(state) => state.showNotification,
	);

	const [statusChanges, setStatusChanges] = useState<
		Record<number, OrderStatus>
	>({});

	const fetchOrders = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await adminApi.getAllOrders(
				filter === "ALL" ? undefined : filter,
			);
			// Sort orders from newest to oldest
			const sortedOrders = data.sort((a, b) => {
				return (
					new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
				);
			});
			setOrders(sortedOrders);
		} catch (error) {
			console.error("Failed to fetch orders:", error);
			showNotification("error", "Failed to load orders");
		} finally {
			setIsLoading(false);
		}
	}, [filter, showNotification]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const handleStatusChange = (orderId: number, newStatus: string) => {
		setStatusChanges((prev) => ({
			...prev,
			[orderId]: newStatus as OrderStatus,
		}));
	};

	const handleUpdateStatus = async (order: Order) => {
		const newStatus = statusChanges[order.orderId];
		if (!newStatus || newStatus === order.status) return;

		try {
			await adminApi.updateOrderStatus(order.orderId, newStatus);
			showNotification(
				"success",
				`Order #${order.orderId} updated to ${newStatus}`,
			);
			// Remove from status changes and refresh
			setStatusChanges((prev) => {
				const updated = { ...prev };
				delete updated[order.orderId];
				return updated;
			});
			await fetchOrders();
		} catch (error) {
			console.error("Failed to update order status:", error);
			showNotification("error", "Failed to update order status");
		}
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStatusVariant = (
		status: OrderStatus,
	): "primary" | "secondary" | "danger" => {
		switch (status) {
			case "COMPLETED":
				return "primary";
			case "PENDING":
				return "secondary";
			case "CANCELLED":
				return "danger";
		}
	};

	const columns: UITableColumn<Order>[] = [
		{
			key: "orderId",
			header: "Order ID",
			render: (order) => `#${order.orderId}`,
		},
		{
			key: "userId",
			header: "User ID",
		},
		{
			key: "orderTime",
			header: "Date",
			render: (order) => formatDate(order.orderTime),
		},
		{
			key: "status",
			header: "Status",
			render: (order) => (
				<UIBadge variant={getStatusVariant(order.status)}>
					{order.status}
				</UIBadge>
			),
		},
		{
			key: "total",
			header: "Total",
			render: (order) => `$${order.total.toFixed(2)}`,
		},
		{
			key: "orderItems",
			header: "Items",
			render: (order) => order.orderItems.length,
		},
		{
			key: "actions",
			header: "Actions",
			render: (order) => (
				<UIFlex gap="sm" align="center">
					<UISelect
						options={STATUS_OPTIONS}
						value={statusChanges[order.orderId] || order.status}
						onChange={(value) => handleStatusChange(order.orderId, value)}
					/>
					<UIButton
						variant="solid"
						colorType="primary"
						onClick={() => handleUpdateStatus(order)}
						disabled={
							!statusChanges[order.orderId] ||
							statusChanges[order.orderId] === order.status
						}
					>
						Update
					</UIButton>
				</UIFlex>
			),
		},
	];

	return (
		<UISection>
			<UIContainer className={styles["admin-orders-page"]}>
				<div className={styles["admin-orders-page__header"]}>
					<h1 className={styles["admin-orders-page__title"]}>Manage Orders</h1>
					<p className={styles["admin-orders-page__subtitle"]}>
						View and update order statuses
					</p>
				</div>

				<div className={styles["admin-orders-page__filters"]}>
					<UIFlex gap="md">
						{(
							["ALL", "PENDING", "COMPLETED", "CANCELLED"] as FilterStatus[]
						).map((status) => (
							<UIButton
								key={status}
								variant={filter === status ? "solid" : "outline"}
								colorType={filter === status ? "primary" : "secondary"}
								onClick={() => setFilter(status)}
							>
								{status}
							</UIButton>
						))}
					</UIFlex>
				</div>

				{isLoading ? (
					<p className={styles["admin-orders-page__loading"]}>
						Loading orders...
					</p>
				) : (
					<UITable columns={columns} data={orders} />
				)}
			</UIContainer>
		</UISection>
	);
};
