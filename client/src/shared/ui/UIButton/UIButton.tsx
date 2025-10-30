import type { ButtonHTMLAttributes, FC } from "react";
import styles from "./UIButton.module.css";

export interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "solid" | "outline";
	colorType?: "primary" | "secondary" | "danger";
	fullWidth?: boolean;
}

export const UIButton: FC<UIButtonProps> = ({
	variant = "solid",
	colorType = "primary",
	fullWidth = false,
	className = "",
	children,
	...props
}) => {
	const classes = [
		styles.button,
		styles[variant],
		styles[colorType],
		fullWidth && styles.fullWidth,
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={classes} {...props}>
			{children}
		</button>
	);
};
