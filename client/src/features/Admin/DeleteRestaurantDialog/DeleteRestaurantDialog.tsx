import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import type { Restaurant } from "@/entities/Restaurant";
import { deleteRestaurant } from "@/entities/Restaurant/api/restaurantApi";
import { useNotificationStore } from "@/shared/model";
import { UIDialog } from "@/shared/ui/UIDialog";
import type { UIDialogRef } from "@/shared/ui/UIDialog";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UIFlex } from "@/shared/ui";
import styles from "./DeleteRestaurantDialog.module.css";

export interface DeleteRestaurantDialogRef {
	open: () => void;
	close: () => void;
}

export interface DeleteRestaurantDialogProps {
	restaurant: Restaurant | null;
	onSuccess?: () => void;
}

export const DeleteRestaurantDialog = forwardRef<
	DeleteRestaurantDialogRef,
	DeleteRestaurantDialogProps
>(({ restaurant, onSuccess }, ref) => {
	const dialogRef = useRef<UIDialogRef>(null);
	const showNotification = useNotificationStore(
		(state) => state.showNotification,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useImperativeHandle(ref, () => ({
		open: () => {
			setError("");
			dialogRef.current?.open();
		},
		close: () => {
			dialogRef.current?.close();
		},
	}));

	const handleConfirmDelete = async () => {
		if (!restaurant) return;

		setIsLoading(true);
		setError("");

		try {
			await deleteRestaurant(restaurant.id);
			showNotification("success", `Restaurant "${restaurant.name}" deleted successfully!`);
			dialogRef.current?.close();
			onSuccess?.();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete restaurant";
			setError(errorMessage);
			showNotification("error", errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		dialogRef.current?.close();
	};

	return (
		<UIDialog
			ref={dialogRef}
			title="Delete Restaurant"
			size="md"
			onClose={handleCancel}
		>
			{error && (
				<div className={styles["delete-restaurant-dialog__error"]}>{error}</div>
			)}

			{restaurant && (
				<div className={styles["delete-restaurant-dialog__content"]}>
					<p className={styles["delete-restaurant-dialog__text"]}>
						Are you sure you want to delete this restaurant? This action cannot
						be undone and will also delete all associated dishes.
					</p>
					<div className={styles["delete-restaurant-dialog__info"]}>
						<strong>Name:</strong> {restaurant.name}
						<br />
						<strong>Address:</strong> {restaurant.address}
					</div>
				</div>
			)}

			<UIFlex gap="md" justify="end">
				<UIButton
					type="button"
					variant="outline"
					colorType="secondary"
					onClick={handleCancel}
					disabled={isLoading}
				>
					Cancel
				</UIButton>
				<UIButton
					type="button"
					variant="solid"
					colorType="danger"
					onClick={handleConfirmDelete}
					disabled={isLoading}
				>
					{isLoading ? "Deleting..." : "Delete Restaurant"}
				</UIButton>
			</UIFlex>
		</UIDialog>
	);
});

DeleteRestaurantDialog.displayName = "DeleteRestaurantDialog";
