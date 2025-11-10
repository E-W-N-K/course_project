import { ApiException } from "./types";

export interface RequestConfig extends RequestInit {
	baseURL?: string;
}

/**
 * Base API client for making HTTP requests
 * Configured to connect to backend at http://localhost:8080
 */
class ApiClient {
	private readonly baseURL: string;

	constructor(baseURL: string = "http://localhost:8080") {
		this.baseURL = baseURL;
	}

	private async request<T>(
		endpoint: string,
		config: RequestConfig = {},
	): Promise<T> {
		const url = `${config.baseURL || this.baseURL}${endpoint}`;

		// Don't set Content-Type for FormData - browser will set it with boundary
		const isFormData = config.body instanceof FormData;
		const headers: HeadersInit = isFormData
			? { ...config.headers }
			: {
					"Content-Type": "application/json",
					...config.headers,
			  };

		try {
			const response = await fetch(url, {
				...config,
				headers,
				credentials: "include", // Include cookies for authentication
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({
					message: "An error occurred",
				}));
				throw new ApiException(
					error.message || "Request failed",
					response.status,
					error.code,
				);
			}

			// Handle 204 No Content responses (e.g., DELETE operations)
			if (response.status === 204) {
				return undefined as T;
			}

			// Check if response has content before parsing JSON
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				return await response.json();
			}

			return undefined as T;
		} catch (error) {
			if (error instanceof ApiException) {
				throw error;
			}
			throw new ApiException(
				error instanceof Error ? error.message : "Network error",
			);
		}
	}

	async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "GET" });
	}

	async post<T>(
		endpoint: string,
		data?: any,
		config?: RequestConfig,
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: "POST",
			body: data instanceof FormData ? data : JSON.stringify(data),
		});
	}

	async put<T>(
		endpoint: string,
		data?: any,
		config?: RequestConfig,
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: "PUT",
			body: data instanceof FormData ? data : JSON.stringify(data),
		});
	}

	async patch<T>(
		endpoint: string,
		data?: any,
		config?: RequestConfig,
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "DELETE" });
	}
}

export const apiClient = new ApiClient();
