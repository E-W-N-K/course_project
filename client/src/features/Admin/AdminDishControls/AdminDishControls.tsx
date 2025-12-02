import { useRef, useState } from "react";
import type { Dish } from "@/entities/Dish";
import {
	EditDishForm,
	type EditDishFormRef,
} from "@/features/Admin/EditDishForm";
import {
	DeleteDishDialog,
	type DeleteDishDialogRef,
} from "@/features/Admin/DeleteDishDialog";
import { UIButton } from "@/shared/ui";
import styles from "./AdminDishControls.module.css";

interface AdminDishControlsProps {
	dish: Dish;
	restaurantId: number;
	onUpdate?: () => void;
}

export const AdminDishControls = ({
	dish,
	restaurantId,
	onUpdate,
}: AdminDishControlsProps) => {
	const editDishFormRef = useRef<EditDishFormRef>(null);
	const deleteDishDialogRef = useRef<DeleteDishDialogRef>(null);
	const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

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
		<>
			<div className={styles["admin-dish-controls"]}>
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

			{/* Admin Dialogs */}
			<EditDishForm
				ref={editDishFormRef}
				restaurantId={restaurantId}
				dish={dish}
				onSuccess={handleDishSuccess}
			/>
			<DeleteDishDialog
				ref={deleteDishDialogRef}
				restaurantId={restaurantId}
				dish={dishToDelete}
				onSuccess={handleDishSuccess}
			/>
		</>
	);
};
