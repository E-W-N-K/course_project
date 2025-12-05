import {
	type DialogHTMLAttributes,
	type ReactNode,
	forwardRef,
	useImperativeHandle,
	useRef,
} from "react";
import { UICard } from "../UICard";
import styles from "./UIDialog.module.css";

export interface UIDialogProps
	extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "children"> {
	title?: string;
	children?: ReactNode;
	footer?: ReactNode;
	size?: "sm" | "md" | "lg";
	onClose?: () => void;
}

export interface UIDialogRef {
	open: () => void;
	close: () => void;
}

export const UIDialog = forwardRef<UIDialogRef, UIDialogProps>(
	(
		{ title, children, footer, size = "md", onClose, className = "", ...props },
		ref,
	) => {
		const dialogRef = useRef<HTMLDialogElement>(null);

		useImperativeHandle(ref, () => ({
			open: () => {
				dialogRef.current?.showModal();
			},
			close: () => {
				dialogRef.current?.close();
			},
		}));

		const handleClose = () => {
			onClose?.();
		};

		const classes = [styles.dialog, styles[`dialog--size-${size}`], className]
			.filter(Boolean)
			.join(" ");

		const header = title ? (
			<div className={styles["dialog__header"]}>
				<h2 className={`heading heading--xl ${styles["dialog__title"]}`}>
					{title}
				</h2>
				<button
					type="button"
					className={styles["dialog__close"]}
					onClick={() => dialogRef.current?.close()}
					aria-label="Close dialog"
				>
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g>
							<path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</g>
					</svg>
				</button>
			</div>
		) : undefined;

		return (
			<dialog
				ref={dialogRef}
				className={classes}
				onClose={handleClose}
				{...props}
			>
				<UICard header={header} footer={footer} padding="xl">
					{children}
				</UICard>
			</dialog>
		);
	},
);

UIDialog.displayName = "UIDialog";
