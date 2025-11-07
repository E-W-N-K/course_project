import { useEffect, useState } from "react";
import { useUserStore } from "@/entities/User";
import { orderApi, type Order } from "@/entities/Order";
import { UICard } from "@/shared/ui/UICard";
import { UIBadge } from "@/shared/ui/UIBadge";
import { UIGrid } from "@/shared/ui/UIGrid";
import styles from "./OrderHistory.module.css";

export const OrderHistory = () => {
	const user = useUserStore((state) => state.user);
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

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
	}, [user]);

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
			<div className={styles["order-history"]}>
				<h2 className={styles["order-history__title"]}>Order History</h2>
				<p className={styles["order-history__loading"]}>Loading orders...</p>
			</div>
		);
	}

	return (
		<div className={styles["order-history"]}>
			<div className={styles["order-history__header"]}>
				<h2 className={styles["order-history__title"]}>Order History</h2>
				<p className={styles["order-history__subtitle"]}>
					You have {orders.length} order{orders.length !== 1 ? "s" : ""}
				</p>
			</div>

			{orders.length === 0 ? (
				<UICard padding="xl">
					<p className={styles["order-history__no-orders"]}>
						No orders found. Start ordering to see your order history!
					</p>
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
		</div>
	);
};
