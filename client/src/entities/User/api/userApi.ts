import { apiClient } from "@/shared/api/client";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "../types";

/**
 * API: Login user
 * POST /auth/login
 * Returns auth response and sets HttpOnly cookie
 */
export const login = async (
	credentials: LoginCredentials,
): Promise<AuthResponse> => {
	return apiClient.post<AuthResponse>("/auth/login", credentials);
};

/**
 * API: Register new user
 * POST /auth/register
 * Returns auth response and sets HttpOnly cookie
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
	return apiClient.post<AuthResponse>("/auth/register", data);
};

/**
 * API: Logout user
 * POST /auth/logout
 * Clears HttpOnly cookie
 */
export const logout = async (): Promise<void> => {
	await apiClient.post<void>("/auth/logout");
};

/**
 * API: Get current authenticated user
 * GET /auth/me
 * Returns user info from JWT cookie
 */
export const getCurrentUser = async (): Promise<User | null> => {
	try {
		return await apiClient.get<User>("/auth/me");
	} catch (error) {
		// Not authenticated
		return null;
	}
};
