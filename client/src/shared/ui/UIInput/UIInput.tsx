import type { InputHTMLAttributes } from "react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import styles from "./UIInput.module.css";

export interface UIInputRef {
	isValid: () => boolean;
	validate: () => void;
}

interface ValidationRules {
	required?: boolean;
	email?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
}

interface UIInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	type?: "text" | "email" | "password" | "tel";
	label?: string;
	validation?: ValidationRules;
	validate?: (value: string) => string | undefined;
	onChange?: (value: string, error?: string) => void;
}

const validateInput = (
	value: string,
	rules?: ValidationRules,
	customValidate?: (value: string) => string | undefined,
): string | undefined => {
	if (!rules && !customValidate) return undefined;

	// Custom validation function takes precedence
	if (customValidate) {
		const customError = customValidate(value);
		if (customError) return customError;
	}

	if (!rules) return undefined;

	// Required validation
	if (rules.required && !value.trim()) {
		return "This field is required";
	}

	// Skip other validations if field is empty and not required
	if (!value.trim()) return undefined;

	// Email validation
	if (rules.email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return "Please enter a valid email address";
		}
	}

	// Min length validation
	if (rules.minLength && value.length < rules.minLength) {
		return `Must be at least ${rules.minLength} characters`;
	}

	// Max length validation
	if (rules.maxLength && value.length > rules.maxLength) {
		return `Must be no more than ${rules.maxLength} characters`;
	}

	// Pattern validation
	if (rules.pattern && !rules.pattern.test(value)) {
		return "Invalid format";
	}

	return undefined;
};

const UIInputComponent = forwardRef<UIInputRef, UIInputProps>(
	(
		{
			type = "text",
			label,
			validation,
			validate,
			onChange,
			className = "",
			id,
			value: controlledValue,
			...props
		},
		ref,
	) => {
		const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
		const [internalValue, setInternalValue] = useState(
			controlledValue?.toString() || "",
		);
		const [internalError, setInternalError] = useState<string | undefined>(
			undefined,
		);
		const [touched, setTouched] = useState(false);

		const value =
			controlledValue !== undefined ? controlledValue : internalValue;
		const displayError = touched ? internalError : undefined;

		useEffect(() => {
			if (controlledValue !== undefined) {
				setInternalValue(controlledValue.toString());
			}
		}, [controlledValue]);

		const handleValidation = (val: string) => {
			const error = validateInput(val, validation, validate);
			setInternalError(error);
			return error;
		};

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setInternalValue(newValue);

			const error = handleValidation(newValue);
			onChange?.(newValue, error);
		};

		const handleBlur = () => {
			setTouched(true);
			handleValidation(value.toString());
		};

		useImperativeHandle(ref, () => ({
			isValid: () => {
				const error = validateInput(value.toString(), validation, validate);
				return !error;
			},
			validate: () => {
				setTouched(true);
				handleValidation(value.toString());
			},
		}));

		return (
			<div className={`${styles.wrapper} ${className}`}>
				{label && (
					<label htmlFor={inputId} className={styles.label}>
						{label}
						{validation?.required && <span className={styles.required}>*</span>}
					</label>
				)}
				<input
					id={inputId}
					type={type}
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					className={`${styles.input} ${displayError ? styles["input--error"] : ""}`}
					{...props}
				/>
				{displayError && <span className={styles.error}>{displayError}</span>}
			</div>
		);
	},
);

UIInputComponent.displayName = "UIInput";

export const UIInput = UIInputComponent;
