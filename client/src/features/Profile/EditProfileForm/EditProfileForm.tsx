import { useState, useEffect } from "react";
import { useUserStore } from "@/entities/User";
import {
	getDeliveryInfo,
	updateDeliveryInfo,
} from "@/entities/User/api/userApi";
import { UICard } from "@/shared/ui";
import { UIForm } from "@/shared/ui/UIForm/UIForm";
import { UIInput } from "@/shared/ui/UIInput/UIInput";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import styles from "./EditProfileForm.module.css";

interface EditProfileFormProps {
	onSave?: () => void;
}

export const EditProfileForm = ({ onSave }: EditProfileFormProps = {}) => {
	const user = useUserStore((state) => state.user);

	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isFetchingDeliveryInfo, setIsFetchingDeliveryInfo] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch delivery info on mount
	useEffect(() => {
		const fetchDeliveryInfo = async () => {
			try {
				const deliveryInfo = await getDeliveryInfo();
				setPhone(deliveryInfo.phone || "");
				setAddress(deliveryInfo.address || "");
			} catch (err) {
				setError("Failed to load delivery information");
			} finally {
				setIsFetchingDeliveryInfo(false);
			}
		};

		if (user) {
			fetchDeliveryInfo();
		}
	}, [user]);

	if (!user) {
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsLoading(true);

		try {
			await updateDeliveryInfo({ phone, address });
			setSuccess("Profile updated successfully!");
			setIsEditing(false);
			setTimeout(() => setSuccess(""), 3000);
			// Call onSave callback if provided
			onSave?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Update failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = async () => {
		// Refetch delivery info to reset form
		try {
			const deliveryInfo = await getDeliveryInfo();
			setPhone(deliveryInfo.phone || "");
			setAddress(deliveryInfo.address || "");
		} catch (err) {
			setError("Failed to reset form");
		}
		setIsEditing(false);
		setError("");
		setSuccess("");
	};

	const handleEdit = () => {
		setIsEditing(true);
		setError("");
		setSuccess("");
	};

	if (isFetchingDeliveryInfo) {
		return (
			<UICard className={styles["edit-profile-form"]} padding="xl">
				<div className={styles["edit-profile-form__header"]}>
					<h2 className={styles["edit-profile-form__title"]}>
						Contact Information
					</h2>
				</div>
				<p>Loading delivery information...</p>
			</UICard>
		);
	}

	return (
		<UICard className={styles["edit-profile-form"]} padding="xl">
			<div className={styles["edit-profile-form__header"]}>
				<h2 className={styles["edit-profile-form__title"]}>
					Contact Information
				</h2>
				{!isEditing && (
					<UIButton variant="outline" colorType="primary" onClick={handleEdit}>
						Edit
					</UIButton>
				)}
			</div>

			{error && (
				<div className={styles["edit-profile-form__error"]}>{error}</div>
			)}
			{success && (
				<div className={styles["edit-profile-form__success"]}>{success}</div>
			)}

			<UIForm
				onSubmit={handleSubmit}
				actions={(isValid) =>
					isEditing ? (
						<div className={styles["edit-profile-form__actions"]}>
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
								{isLoading ? "Saving..." : "Save Changes"}
							</UIButton>
						</div>
					) : null
				}
			>
				<UIInput
					type="tel"
					name="phone"
					label="Phone Number"
					value={phone}
					onChange={(value) => setPhone(value)}
					validation={{ required: true, minLength: 10, maxLength: 20 }}
					disabled={isLoading || !isEditing}
					placeholder="Enter your phone number"
				/>

				<UIInput
					type="text"
					name="address"
					label="Address"
					value={address}
					onChange={(value) => setAddress(value)}
					validation={{ required: true, minLength: 10, maxLength: 100 }}
					disabled={isLoading || !isEditing}
					placeholder="Enter your delivery address"
				/>
			</UIForm>
		</UICard>
	);
};
