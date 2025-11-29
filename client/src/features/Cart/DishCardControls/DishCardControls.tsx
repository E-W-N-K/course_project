import { useState } from "react";
import { useCartStore } from "@/entities/Cart";
import styles from "./DishCardControls.module.css";

interface DishCardControlsProps {
	dishId: number;
	cartItemId: number;
	currentQuantity: number;
	itemTotal: number;
	showSubtotal?: boolean;
	onUpdate?: () => void;
}

export const DishCardControls = ({
	dishId,
	cartItemId,
	currentQuantity,
	itemTotal,
	showSubtotal = true,
	onUpdate,
}: DishCardControlsProps) => {
	const { addToCart, removeItem } = useCartStore();
	const [isUpdating, setIsUpdating] = useState(false);

	const handleIncrease = async () => {
		setIsUpdating(true);
		try {
			await addToCart(dishId, 1);
			onUpdate?.();
		} catch (error) {
			console.error("Failed to increase quantity:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDecrease = async () => {
		setIsUpdating(true);
		try {
			await removeItem(cartItemId, 1);
			onUpdate?.();
		} catch (error) {
			console.error("Failed to decrease quantity:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className={styles["dish-card-controls"]}>
			<div className={styles["dish-card-controls__quantity"]}>
				<button
					className={styles["dish-card-controls__btn"]}
					onClick={handleDecrease}
					disabled={isUpdating}
					aria-label="Decrease quantity"
				>
					-
				</button>
				<span className={styles["dish-card-controls__value"]}>
					{currentQuantity}
				</span>
				<button
					className={styles["dish-card-controls__btn"]}
					onClick={handleIncrease}
					disabled={isUpdating}
					aria-label="Increase quantity"
				>
					+
				</button>
			</div>

			{showSubtotal && (
				<div className={styles["dish-card-controls__actions"]}>
					<span className={styles["dish-card-controls__subtotal"]}>
						${itemTotal.toFixed(2)}
					</span>
				</div>
			)}
		</div>
	);
};
