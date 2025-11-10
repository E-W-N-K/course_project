import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import type { Dish } from "@/entities/Dish";
import { createDish, updateDish } from "@/entities/Dish/api/dishApi";
import { UIDialog } from "@/shared/ui/UIDialog";
import type { UIDialogRef } from "@/shared/ui/UIDialog";
import { UIForm } from "@/shared/ui/UIForm/UIForm";
import { UIInput } from "@/shared/ui/UIInput/UIInput";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UIFlex } from "@/shared/ui";
import styles from "./EditDishForm.module.css";

export interface EditDishFormRef {
	open: () => void;
	close: () => void;
}

export interface EditDishFormProps {
	restaurantId: number;
	dish?: Dish;
	onSuccess?: () => void;
}

export const EditDishForm = forwardRef<EditDishFormRef, EditDishFormProps>(
	({ restaurantId, dish, onSuccess }, ref) => {
		const dialogRef = useRef<UIDialogRef>(null);
		const isEditMode = !!dish;

		const [name, setName] = useState(dish?.name || "");
		const [description, setDescription] = useState(dish?.description || "");
		const [url, setUrl] = useState(dish?.url || "");
		const [price, setPrice] = useState(dish?.price?.toString() || "");
		const [weight, setWeight] = useState(dish?.weight?.toString() || "");
		const [imageFile, setImageFile] = useState<File | null>(null);

		const [isLoading, setIsLoading] = useState(false);
		const [error, setError] = useState("");
		const [success, setSuccess] = useState("");

		useImperativeHandle(ref, () => ({
			open: () => {
				// Reset form when opening
				setName(dish?.name || "");
				setDescription(dish?.description || "");
				setUrl(dish?.url || "");
				setPrice(dish?.price?.toString() || "");
				setWeight(dish?.weight?.toString() || "");
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
				const data = {
					name,
					description,
					url,
					price: parseFloat(price),
					weight: parseFloat(weight),
				};

				if (isEditMode && dish) {
					await updateDish(restaurantId, dish.id, data, imageFile);
					setSuccess("Dish updated successfully!");
				} else {
					await createDish(restaurantId, data, imageFile);
					setSuccess("Dish created successfully!");
				}

				setTimeout(() => {
					dialogRef.current?.close();
					onSuccess?.();
				}, 1000);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to save dish");
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
				title={isEditMode ? "Edit Dish" : "Add Dish"}
				size="lg"
				onClose={handleCancel}
			>
				{error && <div className={styles["edit-dish-form__error"]}>{error}</div>}
				{success && (
					<div className={styles["edit-dish-form__success"]}>{success}</div>
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
										: "Create Dish"}
							</UIButton>
						</UIFlex>
					)}
				>
					<UIInput
						type="text"
						name="name"
						label="Dish Name"
						value={name}
						onChange={(value) => setName(value)}
						validation={{ required: true, minLength: 2, maxLength: 100 }}
						disabled={isLoading}
						placeholder="Enter dish name"
					/>

					<UIInput
						type="text"
						name="description"
						label="Description"
						value={description}
						onChange={(value) => setDescription(value)}
						validation={{ minLength: 10, maxLength: 500 }}
						disabled={isLoading}
						placeholder="Enter dish description (optional)"
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

					<div className={styles["edit-dish-form__file-input"]}>
						<label
							htmlFor="dish-image"
							className={styles["edit-dish-form__file-label"]}
						>
							Upload Image File (Optional)
						</label>
						<input
							id="dish-image"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							disabled={isLoading}
							className={styles["edit-dish-form__file"]}
						/>
						{imageFile && (
							<p className={styles["edit-dish-form__file-name"]}>
								Selected: {imageFile.name}
							</p>
						)}
					</div>

					<UIInput
						type="text"
						name="price"
						label="Price ($)"
						value={price}
						onChange={(value) => setPrice(value)}
						validation={{
							required: true,
							pattern: /^\d+(\.\d{1,2})?$/,
						}}
						disabled={isLoading}
						placeholder="Enter price (e.g., 12.99)"
					/>

					<UIInput
						type="text"
						name="weight"
						label="Weight (g)"
						value={weight}
						onChange={(value) => setWeight(value)}
						validation={{
							required: true,
							pattern: /^\d+(\.\d{1,2})?$/,
						}}
						disabled={isLoading}
						placeholder="Enter weight in grams (e.g., 350)"
					/>
				</UIForm>
			</UIDialog>
		);
	},
);

EditDishForm.displayName = "EditDishForm";
