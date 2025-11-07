import { create } from "zustand";
import type {
	User,
	AuthState,
	LoginCredentials,
	RegisterData,
	UpdateProfileData,
} from "../types";
import * as userApi from "../api/userApi";

interface UserStore extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	setUser: (user: User | null) => void;
	updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true, // Start as true so app waits for initial auth check

	login: async (credentials: LoginCredentials) => {
		set({ isLoading: true });
		try {
			await userApi.login(credentials);
			// Fetch full user info after successful login
			const user = await userApi.getCurrentUser();
			set({
				user,
				isAuthenticated: !!user,
				isLoading: false,
			});
		} catch (error) {
			set({ isLoading: false });
			throw error;
		}
	},

	register: async (data: RegisterData) => {
		set({ isLoading: true });
		try {
			await userApi.register(data);
			// Fetch full user info after successful registration
			const user = await userApi.getCurrentUser();
			set({
				user,
				isAuthenticated: !!user,
				isLoading: false,
			});
		} catch (error) {
			set({ isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		await userApi.logout();
		set({
			user: null,
			isAuthenticated: false,
			isLoading: false,
		});
	},

	checkAuth: async () => {
		set({ isLoading: true });
		try {
			const user = await userApi.getCurrentUser();
			set({
				user,
				isAuthenticated: !!user,
				isLoading: false,
			});
		} catch {
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},

	setUser: (user: User | null) => {
		set({
			user,
			isAuthenticated: !!user,
		});
	},

	updateProfile: async (data: UpdateProfileData) => {
		set({ isLoading: true });
		try {
			await userApi.updateUserProfile(data);
			// Fetch updated user info
			const user = await userApi.getCurrentUser();
			set({
				user,
				isLoading: false,
			});
		} catch (error) {
			set({ isLoading: false });
			throw error;
		}
	},
}));
