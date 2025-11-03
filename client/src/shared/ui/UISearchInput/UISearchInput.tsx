import type { InputHTMLAttributes } from "react";
import styles from "./UISearchInput.module.css";

export interface UISearchInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "onChange"
	> {
	value: string;
	onChange: (value: string) => void;
	onClear?: () => void;
}

export const UISearchInput = ({
	value,
	onChange,
	onClear,
	placeholder = "Search...",
	className = "",
	...props
}: UISearchInputProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleClear = () => {
		onChange("");
		if (onClear) {
			onClear();
		}
	};

	return (
		<div className={`${styles["search-input"]} ${className}`}>
			<div className={styles["search-input__wrapper"]}>
				{/* Search Icon (Left) */}
				<svg
					className={styles["search-input__icon"]}
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>

				{/* Input Field */}
				<input
					type="text"
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className={styles["search-input__input"]}
					{...props}
				/>

				{/* Clear Button (Right, conditional) */}
				{value && (
					<button
						type="button"
						onClick={handleClear}
						className={styles["search-input__clear"]}
						aria-label="Clear search"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
};
