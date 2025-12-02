import { useState } from "react";
import { useCartStore } from "@/entities/Cart";
import styles from "./DishCardControls.module.css";
import { UIButton } from "@/shared/ui";

interface DishCardControlsProps {
	dishId: number;
	cartItemId: number;
	currentQuantity: number;
	onUpdate?: () => void;
}

export const DishCardControls = ({
	dishId,
	cartItemId,
	currentQuantity,
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

	const handleRemove = async () => {
		setIsUpdating(true);
		try {
			await removeItem(cartItemId, currentQuantity);
			onUpdate?.();
		} catch (error) {
			console.error("Failed to remove item:", error);
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

			<UIButton
				onClick={handleRemove}
				disabled={isUpdating}
				colorType={"danger"}
				variant={"outline"}
			>
				Remove
			</UIButton>
		</div>
	);
};
