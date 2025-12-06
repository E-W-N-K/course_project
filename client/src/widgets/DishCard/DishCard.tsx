import { useMemo } from "react";
import type { Dish } from "@/entities/Dish";
import { useCartStore } from "@/entities/Cart";
import { useUserStore } from "@/entities/User";
import { UICard } from "@/shared/ui";
import { buildImageUrl } from "@/shared/lib";
import { AddToCart, DishCardControls } from "@/features/Cart";
import { AdminDishControls } from "@/features/Admin/AdminDishControls";
import styles from "./DishCard.module.css";

interface DishCardProps {
	dish: Dish;
	restaurantId?: number;
	onUpdate?: () => void;
}

export const DishCard = ({
	dish,
	restaurantId,
	onUpdate,
}: DishCardProps) => {
	const { cart } = useCartStore();
	const user = useUserStore((state) => state.user);
	const isAdmin = user?.role === "ADMIN";

	// Use restaurantId from prop OR from dish object (search results)
	const effectiveRestaurantId = restaurantId ?? dish.restaurantId;
	const canEdit = isAdmin && effectiveRestaurantId !== undefined;

	// Find cart item for this dish
	const cartItem = useMemo(() => {
		return cart?.cartItems?.find((item) => item.dishId === dish.id);
	}, [cart, dish.id]);

	return (
		<UICard className={styles["dish-card"]} padding="lg">
			<div className={styles["dish-card__wrapper"]}>
				<div className={styles["dish-card__image-wrapper"]}>
					<img
						src={buildImageUrl(dish.url)}
						alt={dish.name}
						className={styles["dish-card__image"]}
					/>
				</div>

				<div className={styles["dish-card__content"]}>
					<div className={styles["dish-card__header"]}>
						<h3 className={styles["dish-card__name"]}>{dish.name}</h3>
						<div className={styles["dish-card__meta"]}>
							<span className={styles["dish-card__price"]}>
								${dish.price.toFixed(2)}
							</span>
							<span className={styles["dish-card__weight"]}>
								{dish.weight}g
							</span>
						</div>
					</div>

					{dish.description && (
						<p className={styles["dish-card__description"]}>
							{dish.description}
						</p>
					)}

					<div className={styles["dish-card__footer"]}>
						{!isAdmin && (
							<>
								{cartItem ? (
									<DishCardControls
										dishId={dish.id}
										cartItemId={cartItem.id}
										currentQuantity={cartItem.quantity}
									/>
								) : (
									<AddToCart
										dishId={dish.id}
										variant="solid"
										colorType="primary"
									/>
								)}
							</>
						)}

						{canEdit && effectiveRestaurantId && (
							<AdminDishControls
								dish={dish}
								restaurantId={effectiveRestaurantId}
								onUpdate={onUpdate}
							/>
						)}
					</div>
				</div>
			</div>
		</UICard>
	);
};
