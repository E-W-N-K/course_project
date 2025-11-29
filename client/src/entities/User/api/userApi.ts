import { apiClient } from "@/shared/api/client";
import type {
	User,
	LoginCredentials,
	RegisterData,
	AuthResponse,
	UpdateProfileData,
} from "../types";

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
	} catch {
		// Not authenticated
		return null;
	}
};

/**
 * API: Get user delivery info
 * GET /delivery-info
 * Returns phone and address for current user
 */
export const getDeliveryInfo = async (): Promise<{
	phone: string;
	address: string;
}> => {
	return apiClient.get<{ phone: string; address: string }>(
		"/user/delivery-info",
	);
};

/**
 * API: Update user delivery info
 * PUT /delivery-info
 * Updates phone and address for current user
 */
export const updateDeliveryInfo = async (data: {
	phone: string;
	address: string;
}): Promise<{ phone: string; address: string }> => {
	return apiClient.put<{ phone: string; address: string }>(
		"/user/delivery-info",
		data,
	);
};

/**
 * API: Update user profile
 * PATCH /user/profile
 * Updates name, email, phone and address for current user
 */
export const updateUserProfile = async (
	data: UpdateProfileData,
): Promise<User> => {
	return apiClient.patch<User>("/user/profile", data);
};
