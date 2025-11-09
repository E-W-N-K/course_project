import type { SelectHTMLAttributes } from "react";
import styles from "./UISelect.module.css";

interface UISelectOption {
	value: string;
	label: string;
}

interface UISelectProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
	label?: string;
	options: UISelectOption[];
	onChange?: (value: string) => void;
	error?: string;
}

export const UISelect = ({
	label,
	options,
	onChange,
	error,
	className = "",
	id,
	value,
	...props
}: UISelectProps) => {
	const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<div className={`${styles.wrapper} ${className}`}>
			{label && (
				<label htmlFor={selectId} className={styles.label}>
					{label}
				</label>
			)}
			<select
				id={selectId}
				value={value}
				onChange={handleChange}
				className={`${styles.select} ${error ? styles["select--error"] : ""}`}
				{...props}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && <span className={styles.error}>{error}</span>}
		</div>
	);
};
