import type { FC, ReactNode } from "react";
import styles from "./UIMain.module.css";

interface UIMainProps {
	children: ReactNode;
	className?: string;
}

export const UIMain: FC<UIMainProps> = ({ children, className = "" }) => {
	return <main className={`${styles.main} ${className}`}>{children}</main>;
};
