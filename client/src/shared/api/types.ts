export interface ApiResponse<T = any> {
	data?: T;
	message?: string;
	error?: string;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

export class ApiException extends Error {
	status?: number;
	code?: string;

	constructor(message: string, status?: number, code?: string) {
		super(message);
		this.name = "ApiException";
		this.status = status;
		this.code = code;
	}
}

/**
 * API Request/Response DTOs
 * Based on backend request/response DTOs
 */

// Auth Request DTOs
export interface LoginRequest {
	name: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

// Order Request DTOs
export interface OrderItemRequest {
	dishId: number;
	quantity: number;
}

export interface CreateOrderRequest {
	userId: number;
	items: OrderItemRequest[];
}

// Auth Response DTOs
export interface AuthResponse {
	message: string;
	name: string;
	role: string;
}
