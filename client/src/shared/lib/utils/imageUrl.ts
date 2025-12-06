/**
 * API base URL for images
 */
const API_BASE_URL = "http://localhost:8080";

/**
 * Builds a full image URL from a relative or absolute path
 * @param path - Image path (relative or absolute URL)
 * @returns Full image URL with base API URL prepended if needed
 */
export const buildImageUrl = (path: string): string => {
	// If path is already an absolute URL, return as-is
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}

	// Ensure path starts with /
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;

	return `${API_BASE_URL}${normalizedPath}`;
};
