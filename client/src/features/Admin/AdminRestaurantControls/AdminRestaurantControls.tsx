import { useRef, useState } from "react";
import type { Restaurant } from "@/entities/Restaurant";
import {
	EditRestaurantForm,
	type EditRestaurantFormRef,
} from "@/features/Admin/EditRestaurantForm";
import {
	DeleteRestaurantDialog,
	type DeleteRestaurantDialogRef,
} from "@/features/Admin/DeleteRestaurantDialog";
import { UIButton } from "@/shared/ui";
import styles from "./AdminRestaurantControls.module.css";

interface AdminRestaurantControlsProps {
	restaurant: Restaurant;
	onUpdate?: () => void;
	onDelete?: () => void;
}

export const AdminRestaurantControls = ({
	restaurant,
	onUpdate,
	onDelete,
}: AdminRestaurantControlsProps) => {
	const editRestaurantFormRef = useRef<EditRestaurantFormRef>(null);
	const deleteRestaurantDialogRef = useRef<DeleteRestaurantDialogRef>(null);
	const [restaurantToDelete, setRestaurantToDelete] =
		useState<Restaurant | null>(null);

	const handleEditClick = () => {
		editRestaurantFormRef.current?.open();
	};

	const handleDeleteClick = () => {
		setRestaurantToDelete(restaurant);
		deleteRestaurantDialogRef.current?.open();
	};

	const handleEditSuccess = () => {
		onUpdate?.();
	};

	const handleDeleteSuccess = () => {
		onDelete?.();
	};

	return (
		<>
			<div className={styles["admin-restaurant-controls"]}>
				<UIButton
					variant="outline"
					colorType="primary"
					onClick={handleEditClick}
				>
					Edit Restaurant
				</UIButton>
				<UIButton
					variant="outline"
					colorType="danger"
					onClick={handleDeleteClick}
				>
					Delete Restaurant
				</UIButton>
			</div>

			{/* Admin Dialogs */}
			<EditRestaurantForm
				ref={editRestaurantFormRef}
				restaurant={restaurant}
				onSuccess={handleEditSuccess}
			/>
			<DeleteRestaurantDialog
				ref={deleteRestaurantDialogRef}
				restaurant={restaurantToDelete}
				onSuccess={handleDeleteSuccess}
			/>
		</>
	);
};
