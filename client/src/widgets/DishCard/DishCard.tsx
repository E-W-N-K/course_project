import { useMemo } from "react";
import type { Dish } from "@/entities/Dish";
import { useCartStore } from "@/entities/Cart";
import { UICard } from "@/shared/ui";
import { AddToCart, DishCardControls } from "@/features/Cart";
import styles from "./DishCard.module.css";

interface DishCardProps {
	dish: Dish;
	showSubtotal?: boolean;
}

export const DishCard = ({ dish, showSubtotal = false }: DishCardProps) => {
	const { cart } = useCartStore();

	// Find cart item for this dish
	const cartItem = useMemo(() => {
		return cart?.cartItems?.find((item) => item.dishId === dish.id);
	}, [cart, dish.id]);

	return (
		<UICard className={styles["dish-card"]} padding="lg">
			<div className={styles["dish-card__wrapper"]}>
				<div className={styles["dish-card__image-wrapper"]}>
					<img
						src={dish.url}
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
							<span className={styles["dish-card__weight"]}>{dish.weight}g</span>
						</div>
					</div>

					{dish.description && (
						<p className={styles["dish-card__description"]}>
							{dish.description}
						</p>
					)}

					<div className={styles["dish-card__footer"]}>
						{cartItem ? (
							<DishCardControls
								dishId={dish.id}
								cartItemId={cartItem.id}
								currentQuantity={cartItem.quantity}
								itemTotal={cartItem.itemTotal}
								showRemove={true}
								showSubtotal={showSubtotal}
							/>
						) : (
							<AddToCart
								dishId={dish.id}
								variant="solid"
								colorType="primary"
							/>
						)}
					</div>
				</div>
			</div>
		</UICard>
	);
};
