import type {
	User,
	LoginCredentials,
	RegisterData,
	AuthResponse,
} from "../types";

const STORAGE_KEY = "food_delivery_session";
const USERS_KEY = "food_delivery_users";

// Mock-specific response that includes the full user object
// In production, the backend returns AuthResponse (name, role, message)
// and the full user object would be fetched separately
interface MockAuthResponse extends AuthResponse {
	user: User;
}

// Mock users database (in real app, this would be on the server)
const getUsers = (): User[] => {
	const stored = localStorage.getItem(USERS_KEY);
	if (stored) {
		return JSON.parse(stored);
	}

	// Default users for testing
	const defaultUsers: User[] = [
		{
			id: 1,
			email: "admin@example.com",
			name: "Admin User",
			role: "admin",
			active: true,
		},
		{
			id: 2,
			email: "user@example.com",
			name: "Regular User",
			role: "user",
			active: true,
		},
	];

	localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
	return defaultUsers;
};

const saveUsers = (users: User[]): void => {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Simulate network delay
const delay = (ms: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const login = async (
	credentials: LoginCredentials,
): Promise<MockAuthResponse> => {
	await delay();

	const users = getUsers();

	// In a real app, password would be hashed and verified on the server
	// For mock, we'll accept any password and find user by name
	const user = users.find((u) => u.name === credentials.name);

	if (!user) {
		throw new Error("Invalid username or password");
	}

	// Store session
	localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

	return {
		message: "Login successful",
		name: user.name,
		role: user.role,
		user,
	};
};

export const register = async (
	data: RegisterData,
): Promise<MockAuthResponse> => {
	await delay();

	const users = getUsers();

	// Check if user already exists
	if (users.some((u) => u.email === data.email)) {
		throw new Error("User with this email already exists");
	}

	// Create new user
	const newUser: User = {
		id: Date.now(),
		email: data.email,
		name: data.name,
		role: "user",
		active: true,
	};

	// Save to mock database
	users.push(newUser);
	saveUsers(users);

	// Store session
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

	return {
		message: "Registration successful",
		name: newUser.name,
		role: newUser.role,
		user: newUser,
	};
};

export const logout = async (): Promise<void> => {
	await delay(200);
	localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = async (): Promise<MockAuthResponse> => {
	await delay(300);

	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) {
		return {
			message: "Not authenticated",
			name: "",
			role: "",
			user: null as any,
		};
	}

	const user: User = JSON.parse(stored);
	return {
		message: "User found",
		name: user.name,
		role: user.role,
		user,
	};
};
