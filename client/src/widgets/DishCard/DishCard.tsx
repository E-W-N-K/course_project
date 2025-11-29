import { useMemo, useRef, useState } from "react";
import type { Dish } from "@/entities/Dish";
import { useCartStore } from "@/entities/Cart";
import { useUserStore } from "@/entities/User";
import { UICard } from "@/shared/ui";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { AddToCart, DishCardControls } from "@/features/Cart";
import {
	EditDishForm,
	type EditDishFormRef,
} from "@/features/Admin/EditDishForm";
import {
	DeleteDishDialog,
	type DeleteDishDialogRef,
} from "@/features/Admin/DeleteDishDialog";
import styles from "./DishCard.module.css";

interface DishCardProps {
	dish: Dish;
	showSubtotal?: boolean;
	restaurantId?: number;
	onUpdate?: () => void;
}

export const DishCard = ({
	dish,
	showSubtotal = false,
	restaurantId,
	onUpdate,
}: DishCardProps) => {
	const { cart } = useCartStore();
	const user = useUserStore((state) => state.user);
	const isAdmin = user?.role === "ADMIN";

	// Use restaurantId from prop OR from dish object (search results)
	const effectiveRestaurantId = restaurantId ?? dish.restaurantId;
	const canEdit = isAdmin && effectiveRestaurantId !== undefined;

	const editDishFormRef = useRef<EditDishFormRef>(null);
	const deleteDishDialogRef = useRef<DeleteDishDialogRef>(null);
	const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

	// Find cart item for this dish
	const cartItem = useMemo(() => {
		return cart?.cartItems?.find((item) => item.dishId === dish.id);
	}, [cart, dish.id]);

	const handleEditClick = () => {
		editDishFormRef.current?.open();
	};

	const handleDeleteClick = () => {
		setDishToDelete(dish);
		deleteDishDialogRef.current?.open();
	};

	const handleDishSuccess = () => {
		onUpdate?.();
	};

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

					{!isAdmin && (
						<div className={styles["dish-card__footer"]}>
							{cartItem ? (
								<DishCardControls
									dishId={dish.id}
									cartItemId={cartItem.id}
									currentQuantity={cartItem.quantity}
									itemTotal={cartItem.itemTotal}
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
					)}

					{canEdit && (
						<div className={styles["dish-card__footer"]}>
							<div className={styles["dish-card__admin-footer"]}>
								<UIButton
									variant="outline"
									colorType="primary"
									onClick={handleEditClick}
								>
									Edit
								</UIButton>
								<UIButton
									variant="outline"
									colorType="danger"
									onClick={handleDeleteClick}
								>
									Delete
								</UIButton>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Admin Dialogs */}
			{canEdit && effectiveRestaurantId && (
				<>
					<EditDishForm
						ref={editDishFormRef}
						restaurantId={effectiveRestaurantId}
						dish={dish}
						onSuccess={handleDishSuccess}
					/>
					<DeleteDishDialog
						ref={deleteDishDialogRef}
						restaurantId={effectiveRestaurantId}
						dish={dishToDelete}
						onSuccess={handleDishSuccess}
					/>
				</>
			)}
		</UICard>
	);
};
