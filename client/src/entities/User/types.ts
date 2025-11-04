/**
 * User entity types
 * Based on UserInfoDTO, UserDTO, UserWithCustomerInfoDTO, and CustomerInfoDTO from backend
 */

export type UserRole = "admin" | "user";

/**
 * Base user information (matches UserInfoDTO)
 */
export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	active: boolean;
}

/**
 * User with password (matches UserDTO - extends UserInfoDTO)
 * Used for registration/authentication
 */
export interface UserWithPassword extends User {
	password: string;
}

/**
 * Customer contact information (matches CustomerInfoDTO)
 */
export interface CustomerInfo {
	id: number;
	address: string;
	phone: string;
	userId: number;
}

/**
 * User with customer information (matches UserWithCustomerInfoDTO)
 * Used for displaying user profile with delivery details
 */
export interface UserWithCustomerInfo extends User {
	address: string;
	phone: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface LoginCredentials {
	name: string;
	password: string;
}

export interface RegisterData {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	message: string;
	name: string;
	role: string;
}
