import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { UIForm } from "@/shared/ui/UIForm/UIForm";
import { UIInput } from "@/shared/ui/UIInput/UIInput";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import styles from "./LoginForm.module.css";

export const LoginForm = () => {
	const navigate = useNavigate();
	const login = useUserStore((state) => state.login);
	const isLoading = useUserStore((state) => state.isLoading);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await login({ email, password });
			navigate("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		}
	};

	return (
		<UIForm onSubmit={handleSubmit} className={styles["login-form"]}>
			<div className={styles["login-form__group"]}>
				<UIInput
					type="email"
					name="email"
					label="Email"
					value={email}
					onChange={(value) => setEmail(value)}
					required
					disabled={isLoading}
					placeholder="Enter your email"
				/>
			</div>

			<div className={styles["login-form__group"]}>
				<UIInput
					type="password"
					name="password"
					label="Password"
					value={password}
					onChange={(value) => setPassword(value)}
					required
					disabled={isLoading}
					placeholder="Enter your password"
					minLength={6}
				/>
			</div>

			{error && <div className={styles["login-form__error"]}>{error}</div>}

			<UIButton
				type="submit"
				variant="solid"
				colorType="primary"
				disabled={isLoading}
				fullWidth
			>
				{isLoading ? "Logging in..." : "Login"}
			</UIButton>

			<div className={styles["login-form__hint"]}>
				<p className={styles["login-form__hint-title"]}>Test accounts:</p>
				<p className={styles["login-form__hint-text"]}>
					Admin: admin@example.com
				</p>
				<p className={styles["login-form__hint-text"]}>
					User: user@example.com
				</p>
				<p className={styles["login-form__hint-text"]}>
					Password: any password
				</p>
			</div>
		</UIForm>
	);
};
