import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { UIForm } from "@/shared/ui/UIForm/UIForm";
import { UIInput } from "@/shared/ui/UIInput/UIInput";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UICard } from "@/shared/ui";
import styles from "./RegisterForm.module.css";

export const RegisterForm = () => {
	const navigate = useNavigate();
	const register = useUserStore((state) => state.register);
	const isLoading = useUserStore((state) => state.isLoading);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await register({ name, email, password });
			navigate("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		}
	};

	return (
		<UICard className={styles["register-form"]} padding="xl">
			<UIForm
				onSubmit={handleSubmit}
				actions={(isValid) => (
					<div className={styles["register-form__actions"]}>
						{error && (
							<div className={styles["register-form__error"]}>{error}</div>
						)}

						<UIButton
							type="submit"
							variant="solid"
							colorType="primary"
							disabled={isLoading || !isValid}
							fullWidth
						>
							{isLoading ? "Creating account..." : "Register"}
						</UIButton>
					</div>
				)}
			>
				<UIInput
					type="text"
					name="name"
					label="Full Name"
					value={name}
					onChange={(value) => setName(value)}
					validation={{ required: true, minLength: 2 }}
					disabled={isLoading}
					placeholder="Enter your full name"
				/>

				<UIInput
					type="email"
					name="email"
					label="Email"
					value={email}
					onChange={(value) => setEmail(value)}
					validation={{ required: true, email: true }}
					disabled={isLoading}
					placeholder="Enter your email"
				/>

				<UIInput
					type="password"
					name="password"
					label="Password"
					value={password}
					onChange={(value) => setPassword(value)}
					validation={{ required: true, minLength: 6 }}
					disabled={isLoading}
					placeholder="Enter your password"
				/>
			</UIForm>
		</UICard>
	);
};
