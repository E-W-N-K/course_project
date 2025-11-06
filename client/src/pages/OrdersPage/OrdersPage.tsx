import { useEffect, useState } from "react";
import { useUserStore } from "@/entities/User";
import { orderApi, type Order } from "@/entities/Order";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UICard } from "@/shared/ui/UICard";
import { UIBadge } from "@/shared/ui/UIBadge";
import { UIGrid } from "@/shared/ui/UIGrid";
import styles from "./OrdersPage.module.css";

export const OrdersPage = () => {
	const { user } = useUserStore();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const isAdmin = user?.role === "admin";

	useEffect(() => {
		const fetchOrders = async () => {
			if (!user) return;

			try {
				setIsLoading(true);
				const data = await orderApi.getUserOrders();
				setOrders(data);
			} catch (error) {
				console.error("Failed to fetch orders:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, [user, isAdmin]);

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
		status: Order["status"],
	): "primary" | "secondary" | "danger" => {
		switch (status) {
			case "COMPLETED":
				return "primary";
			case "PENDING":
				return "secondary";
			case "CANCELLED":
				return "danger";
			default:
				return "secondary";
		}
	};

	if (isLoading) {
		return (
			<UIContainer className={styles["orders-page"]}>
				<p className={styles["orders-page__loading"]}>Loading orders...</p>
			</UIContainer>
		);
	}

	return (
		<UIContainer className={styles["orders-page"]}>
			<div className={styles["orders-page__header"]}>
				<h1 className={styles["orders-page__title"]}>
					{isAdmin ? "All Orders" : "My Orders"}
				</h1>
				<p className={styles["orders-page__subtitle"]}>
					{isAdmin
						? `Viewing all orders (${orders.length} total)`
						: `You have ${orders.length} order${orders.length !== 1 ? "s" : ""}`}
				</p>
			</div>

			{orders.length === 0 ? (
				<UICard padding="xl">
					<p className={styles["orders-page__no-orders"]}>No orders found.</p>
				</UICard>
			) : (
				<UIGrid columns={2} gap="lg">
					{orders.map((order) => (
						<UICard key={order.orderId} padding="lg">
							<div className={styles["order-card"]}>
								<div className={styles["order-card__header"]}>
									<div className={styles["order-card__header-left"]}>
										<h3 className={styles["order-card__id"]}>
											Order #{order.orderId}
										</h3>
										<p className={styles["order-card__date"]}>
											{formatDate(order.orderTime)}
										</p>
									</div>
									<UIBadge variant={getStatusVariant(order.status)}>
										{order.status}
									</UIBadge>
								</div>

								{isAdmin && (
									<div className={styles["order-card__customer"]}>
										<strong>Customer ID:</strong> {order.userId}
									</div>
								)}

								<div className={styles["order-card__items"]}>
									<h4 className={styles["order-card__items-title"]}>Items:</h4>
									<ul className={styles["order-card__items-list"]}>
										{order.orderItems.map((item) => (
											<li key={item.id} className={styles["order-card__item"]}>
												<span className={styles["order-card__item-name"]}>
													Dish #{item.dishId}
												</span>
												<span className={styles["order-card__item-quantity"]}>
													x{item.quantity}
												</span>
												<span className={styles["order-card__item-price"]}>
													${item.itemTotal.toFixed(2)}
												</span>
											</li>
										))}
									</ul>
								</div>

								<div className={styles["order-card__footer"]}>
									<span className={styles["order-card__total-label"]}>
										Total:
									</span>
									<span className={styles["order-card__total-amount"]}>
										${order.total.toFixed(2)}
									</span>
								</div>
							</div>
						</UICard>
					))}
				</UIGrid>
			)}
		</UIContainer>
	);
};
