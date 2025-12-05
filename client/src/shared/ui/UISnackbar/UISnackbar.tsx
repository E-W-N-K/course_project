import type { FC } from "react";
import styles from "./UISnackbar.module.css";

export interface UISnackbarProps {
	variant: "success" | "error";
	message: string;
	onClose: () => void;
	className?: string;
}

export const UISnackbar: FC<UISnackbarProps> = ({
	variant,
	message,
	onClose,
	className = "",
}) => {
	const classes = [
		styles.snackbar,
		styles[`snackbar--${variant}`],
		className,
	]
		.filter(Boolean)
		.join(" ");

	const icon = variant === "success" ? "✓" : "✕";

	return (
		<div className={classes} role="alert" aria-live="polite">
			<div className={styles["snackbar__content"]}>
				<span className={styles["snackbar__icon"]}>{icon}</span>
				<span className={styles["snackbar__message"]}>{message}</span>
			</div>
			<button
				type="button"
				className={styles["snackbar__close"]}
				onClick={onClose}
				aria-label="Close notification"
			>
				×
			</button>
		</div>
	);
};
