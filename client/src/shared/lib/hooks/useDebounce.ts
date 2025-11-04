import { useState, useEffect } from "react";

/**
 * Debounce hook to delay execution until after a specified delay
 * Useful for search inputs to prevent excessive API calls
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set up a timer to update the debounced value after delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timer if value changes before delay completes
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};
