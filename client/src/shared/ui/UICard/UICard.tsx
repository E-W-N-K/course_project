import type { FC, ReactNode } from "react";
import styles from "./UICard.module.css";

interface UICardProps {
	children?: ReactNode;
	header?: ReactNode;
	footer?: ReactNode;
	className?: string;
	padding?: "sm" | "md" | "lg" | "xl";
}

export const UICard: FC<UICardProps> = ({
	children,
	header,
	footer,
	className = "",
	padding = "lg",
}) => {
	const classes = [styles.card, styles[`card--padding-${padding}`], className]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classes}>
			{header && <header className={styles.card__header}>{header}</header>}
			{children && <div className={styles.card__body}>{children}</div>}
			{footer && <footer className={styles.card__footer}>{footer}</footer>}
		</div>
	);
};
