import { ApiException } from "./types";

export interface RequestConfig extends RequestInit {
	baseURL?: string;
}

/**
 * Base API client for making HTTP requests
 * Currently configured for future backend integration
 * Mock APIs bypass this client and use localStorage directly
 */
class ApiClient {
	private baseURL: string;

	constructor(baseURL: string = "/api") {
		this.baseURL = baseURL;
	}

	private async request<T>(
		endpoint: string,
		config: RequestConfig = {},
	): Promise<T> {
		const url = `${config.baseURL || this.baseURL}${endpoint}`;

		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...config.headers,
		};

		try {
			const response = await fetch(url, {
				...config,
				headers,
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

			return await response.json();
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
			body: JSON.stringify(data),
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
			body: JSON.stringify(data),
		});
	}

	async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "DELETE" });
	}
}

export const apiClient = new ApiClient();
