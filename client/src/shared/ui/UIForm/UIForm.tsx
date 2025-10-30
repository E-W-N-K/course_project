import type { ReactNode, FormEvent } from "react";
import {
	useState,
	useRef,
	useEffect,
	Children,
	cloneElement,
	isValidElement,
} from "react";
import type { UIInputRef } from "../UIInput/UIInput";
import styles from "./UIForm.module.css";

interface UIFormProps {
	children: ReactNode;
	actions?: ReactNode | ((isValid: boolean) => ReactNode);
	className?: string;
	onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export const UIForm = ({
	children,
	actions,
	className = "",
	onSubmit,
}: UIFormProps) => {
	const [isFormValid, setIsFormValid] = useState(false);
	const inputRefs = useRef<(UIInputRef | null)[]>([]);

	const checkFormValidity = () => {
		const validRefs = inputRefs.current.filter(
			(ref): ref is UIInputRef => ref !== null,
		);
		const allValid =
			validRefs.length === 0 || validRefs.every((ref) => ref.isValid());
		setIsFormValid(allValid);
	};

	useEffect(() => {
		checkFormValidity();
	}, []);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate all inputs on submit
		inputRefs.current.forEach((ref) => ref?.validate());

		// Recheck validity after validation
		setTimeout(() => {
			checkFormValidity();
			const validRefs = inputRefs.current.filter(
				(ref): ref is UIInputRef => ref !== null,
			);
			if (validRefs.every((ref) => ref.isValid())) {
				onSubmit?.(e);
			}
		}, 0);
	};

	// Clone children and attach refs to UIInput components
	let refIndex = 0;
	const childrenWithRefs = Children.map(children, (child) => {
		if (isValidElement(child)) {
			const childType = child.type as { displayName?: string };
			// Check if this is a UIInput component by checking displayName
			if (childType?.displayName === "UIInput") {
				const currentIndex = refIndex++;
				const originalOnChange = (
					child.props as { onChange?: (value: string, error?: string) => void }
				).onChange;

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return cloneElement(child as any, {
					ref: (ref: UIInputRef | null) => {
						inputRefs.current[currentIndex] = ref;
					},
					onChange: (value: string, error?: string) => {
						// Call original onChange if it exists
						originalOnChange?.(value, error);
						// Check form validity after a short delay to let state update
						setTimeout(checkFormValidity, 0);
					},
				});
			}
		}
		return child;
	});

	const renderedActions =
		typeof actions === "function" ? actions(isFormValid) : actions;

	return (
		<form className={`${styles.form} ${className}`} onSubmit={handleSubmit}>
			<div className={styles.form__fields}>{childrenWithRefs}</div>
			{renderedActions && (
				<div className={styles.form__actions}>{renderedActions}</div>
			)}
		</form>
	);
};
