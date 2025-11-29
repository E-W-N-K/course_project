import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import type { Restaurant } from "@/entities/Restaurant";
import {
	createRestaurant,
	updateRestaurant,
} from "@/entities/Restaurant/api/restaurantApi";
import { UIDialog } from "@/shared/ui/UIDialog";
import type { UIDialogRef } from "@/shared/ui/UIDialog";
import { UIForm } from "@/shared/ui/UIForm/UIForm";
import { UIInput } from "@/shared/ui/UIInput/UIInput";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UIFlex } from "@/shared/ui";
import styles from "./EditRestaurantForm.module.css";

export interface EditRestaurantFormRef {
	open: () => void;
	close: () => void;
}

export interface EditRestaurantFormProps {
	restaurant?: Restaurant;
	onSuccess?: () => void;
}

export const EditRestaurantForm = forwardRef<
	EditRestaurantFormRef,
	EditRestaurantFormProps
>(({ restaurant, onSuccess }, ref) => {
	const dialogRef = useRef<UIDialogRef>(null);
	const isEditMode = !!restaurant;

	const [name, setName] = useState(restaurant?.name || "");
	const [description, setDescription] = useState(restaurant?.description || "");
	const [address, setAddress] = useState(restaurant?.address || "");
	const [phone, setPhone] = useState(restaurant?.phone || "");
	const [url, setUrl] = useState(restaurant?.url || "");
	const [imageFile, setImageFile] = useState<File | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useImperativeHandle(ref, () => ({
		open: () => {
			// Reset form when opening
			setName(restaurant?.name || "");
			setDescription(restaurant?.description || "");
			setAddress(restaurant?.address || "");
			setPhone(restaurant?.phone || "");
			setUrl(restaurant?.url || "");
			setImageFile(null);
			setError("");
			setSuccess("");
			dialogRef.current?.open();
		},
		close: () => {
			dialogRef.current?.close();
		},
	}));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsLoading(true);

		try {
			const data = { name, description, address, phone, url };

			if (isEditMode) {
				await updateRestaurant(restaurant.id, data, imageFile);
				setSuccess("Restaurant updated successfully!");
			} else {
				await createRestaurant(data, imageFile);
				setSuccess("Restaurant created successfully!");
			}

			setTimeout(() => {
				dialogRef.current?.close();
				onSuccess?.();
			}, 1000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save restaurant",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
		}
	};

	const handleCancel = () => {
		dialogRef.current?.close();
	};

	return (
		<UIDialog
			ref={dialogRef}
			title={isEditMode ? "Edit Restaurant" : "Add Restaurant"}
			size="lg"
			onClose={handleCancel}
		>
			{error && (
				<div className={styles["edit-restaurant-form__error"]}>{error}</div>
			)}
			{success && (
				<div className={styles["edit-restaurant-form__success"]}>{success}</div>
			)}

			<UIForm
				onSubmit={handleSubmit}
				actions={(isValid) => (
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
							type="submit"
							variant="solid"
							colorType="primary"
							disabled={isLoading || !isValid}
						>
							{isLoading
								? "Saving..."
								: isEditMode
									? "Save Changes"
									: "Create Restaurant"}
						</UIButton>
					</UIFlex>
				)}
			>
				<UIInput
					type="text"
					name="name"
					label="Restaurant Name"
					value={name}
					onChange={(value) => setName(value)}
					validation={{ required: true, minLength: 2, maxLength: 100 }}
					disabled={isLoading}
					placeholder="Enter restaurant name"
				/>

				<UIInput
					type="text"
					name="description"
					label="Description"
					value={description}
					onChange={(value) => setDescription(value)}
					validation={{ required: true, minLength: 10, maxLength: 500 }}
					disabled={isLoading}
					placeholder="Enter restaurant description"
				/>

				<UIInput
					type="text"
					name="address"
					label="Address"
					value={address}
					onChange={(value) => setAddress(value)}
					validation={{ required: true, minLength: 5, maxLength: 200 }}
					disabled={isLoading}
					placeholder="Enter restaurant address"
				/>

				<UIInput
					type="tel"
					name="phone"
					label="Phone Number"
					value={phone}
					onChange={(value) => setPhone(value)}
					validation={{ required: true, minLength: 10, maxLength: 20 }}
					disabled={isLoading}
					placeholder="Enter phone number"
				/>

				<UIInput
					type="text"
					name="url"
					label="Image URL (Optional if uploading file)"
					value={url}
					onChange={(value) => setUrl(value)}
					validation={{ required: !imageFile, minLength: 5 }}
					disabled={isLoading || !!imageFile}
					placeholder="Enter image URL or upload file below"
				/>

				<div className={styles["edit-restaurant-form__file-input"]}>
					<label
						htmlFor="restaurant-image"
						className={styles["edit-restaurant-form__file-label"]}
					>
						Upload Image File (Optional)
					</label>
					<input
						id="restaurant-image"
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						disabled={isLoading}
						className={styles["edit-restaurant-form__file"]}
					/>
					{imageFile && (
						<p className={styles["edit-restaurant-form__file-name"]}>
							Selected: {imageFile.name}
						</p>
					)}
				</div>
			</UIForm>
		</UIDialog>
	);
});

EditRestaurantForm.displayName = "EditRestaurantForm";
