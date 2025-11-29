import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import type { Dish } from "@/entities/Dish";
import { deleteDish } from "@/entities/Dish/api/dishApi";
import { UIDialog } from "@/shared/ui/UIDialog";
import type { UIDialogRef } from "@/shared/ui/UIDialog";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UIFlex } from "@/shared/ui";
import styles from "./DeleteDishDialog.module.css";

export interface DeleteDishDialogRef {
	open: () => void;
	close: () => void;
}

export interface DeleteDishDialogProps {
	restaurantId: number;
	dish: Dish | null;
	onSuccess?: () => void;
}

export const DeleteDishDialog = forwardRef<
	DeleteDishDialogRef,
	DeleteDishDialogProps
>(({ restaurantId, dish, onSuccess }, ref) => {
	const dialogRef = useRef<UIDialogRef>(null);
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
		if (!dish) return;

		setIsLoading(true);
		setError("");

		try {
			await deleteDish(restaurantId, dish.id);
			dialogRef.current?.close();
			onSuccess?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete dish");
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
			title="Delete Dish"
			size="md"
			onClose={handleCancel}
		>
			{error && (
				<div className={styles["delete-dish-dialog__error"]}>{error}</div>
			)}

			{dish && (
				<div className={styles["delete-dish-dialog__content"]}>
					<p className={styles["delete-dish-dialog__text"]}>
						Are you sure you want to delete this dish? This action cannot be
						undone.
					</p>
					<div className={styles["delete-dish-dialog__info"]}>
						<strong>Name:</strong> {dish.name}
						<br />
						<strong>Price:</strong> ${dish.price.toFixed(2)}
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
					{isLoading ? "Deleting..." : "Delete Dish"}
				</UIButton>
			</UIFlex>
		</UIDialog>
	);
});

DeleteDishDialog.displayName = "DeleteDishDialog";
