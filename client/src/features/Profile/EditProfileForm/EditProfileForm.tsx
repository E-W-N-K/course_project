import { useState } from "react";
import { useUserStore } from "@/entities/User";
import { UICard } from "@/shared/ui";
import { UIForm } from "@/shared/ui/UIForm/UIForm";
import { UIInput } from "@/shared/ui/UIInput/UIInput";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import styles from "./EditProfileForm.module.css";

export const EditProfileForm = () => {
	const user = useUserStore((state) => state.user);
	const updateProfile = useUserStore((state) => state.updateProfile);
	const isLoading = useUserStore((state) => state.isLoading);

	const [email, setEmail] = useState(user?.email || "");
	const [phone, setPhone] = useState(user?.phone || "");
	const [address, setAddress] = useState(user?.address || "");
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	if (!user) {
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			await updateProfile({ email, phone, address });
			setSuccess("Profile updated successfully!");
			setIsEditing(false);
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Update failed");
		}
	};

	const handleCancel = () => {
		setEmail(user.email || "");
		setPhone(user.phone || "");
		setAddress(user.address || "");
		setIsEditing(false);
		setError("");
		setSuccess("");
	};

	const handleEdit = () => {
		setIsEditing(true);
		setError("");
		setSuccess("");
	};

	return (
		<UICard className={styles["edit-profile-form"]} padding="xl">
			<div className={styles["edit-profile-form__header"]}>
				<h2 className={styles["edit-profile-form__title"]}>Contact Information</h2>
				{!isEditing && (
					<UIButton
						variant="outline"
						colorType="primary"
						onClick={handleEdit}
					>
						Edit
					</UIButton>
				)}
			</div>

			{error && <div className={styles["edit-profile-form__error"]}>{error}</div>}
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
					type="email"
					name="email"
					label="Email"
					value={email}
					onChange={(value) => setEmail(value)}
					validation={{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
					disabled={isLoading || !isEditing}
					placeholder="Enter your email address"
				/>

				<UIInput
					type="tel"
					name="phone"
					label="Phone Number"
					value={phone}
					onChange={(value) => setPhone(value)}
					validation={{ required: true, minLength: 10 }}
					disabled={isLoading || !isEditing}
					placeholder="Enter your phone number"
				/>

				<UIInput
					type="text"
					name="address"
					label="Address"
					value={address}
					onChange={(value) => setAddress(value)}
					validation={{ required: true, minLength: 10 }}
					disabled={isLoading || !isEditing}
					placeholder="Enter your delivery address"
				/>
			</UIForm>
		</UICard>
	);
};
