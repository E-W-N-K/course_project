import type { FC, ReactNode } from "react";
import styles from "./UIFlex.module.css";

interface UIFlexProps {
	children: ReactNode;
	className?: string;
	direction?: "row" | "column";
	align?: "start" | "center" | "end" | "stretch";
	justify?: "start" | "center" | "end" | "between" | "around";
	gap?: "sm" | "md" | "lg" | "xl" | "2xl";
	wrap?: boolean;
}

export const UIFlex: FC<UIFlexProps> = ({
	children,
	className = "",
	direction = "row",
	align = "start",
	justify = "start",
	gap = "lg",
	wrap = false,
}) => {
	const classes = [
		styles.flex,
		styles[`flex--direction-${direction}`],
		styles[`flex--align-${align}`],
		styles[`flex--justify-${justify}`],
		styles[`flex--gap-${gap}`],
		wrap && styles["flex--wrap"],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return <div className={classes}>{children}</div>;
};
