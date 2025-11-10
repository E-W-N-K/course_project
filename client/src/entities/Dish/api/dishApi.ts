import { apiClient } from "@/shared/api/client";
import type { Dish } from "../types";

/**
 * API: Get all dishes
 * Helper function - fetches all dishes from all restaurants
 */
export const getAllDishes = async (): Promise<Dish[]> => {
	// This would require fetching from all restaurants
	// For now, this is a placeholder - backend doesn't have a dedicated endpoint
	throw new Error("getAllDishes not supported by backend - use getDishesByRestaurant instead");
};

/**
 * API: Get dishes by restaurant ID
 * GET /restaurants/{restaurantId}/dishes
 */
export const getDishesByRestaurant = async (
	restaurantId: number,
): Promise<Dish[]> => {
	return apiClient.get<Dish[]>(`/restaurants/${restaurantId}/dishes`);
};

/**
 * API: Get single dish by ID and restaurant ID
 * GET /restaurants/{restaurantId}/dishes/{dishId}
 */
export const getDishById = async (
	restaurantId: number,
	dishId: number,
): Promise<Dish | null> => {
	try {
		return await apiClient.get<Dish>(`/restaurants/${restaurantId}/dishes/${dishId}`);
	} catch {
		return null;
	}
};

/**
 * API: Search dishes by name (across all restaurants)
 * GET /restaurants/searchDish?dishName={dishName}
 */
export const searchDishes = async (dishName: string): Promise<Dish[]> => {
	if (!dishName.trim()) {
		return [];
	}
	return apiClient.get<Dish[]>(`/restaurants/searchDish?dishName=${encodeURIComponent(dishName)}`);
};

/**
 * API: Search dishes by name in specific restaurant
 * GET /restaurants/{restaurantId}/dishes/searchDish?dishName={dishName}
 */
export const searchDishesInRestaurant = async (
	restaurantId: number,
	dishName: string,
): Promise<Dish[]> => {
	if (!dishName.trim()) {
		return getDishesByRestaurant(restaurantId);
	}
	return apiClient.get<Dish[]>(
		`/restaurants/${restaurantId}/dishes/searchDish?dishName=${encodeURIComponent(dishName)}`
	);
};

/**
 * API: Create new dish for a restaurant
 * POST /admin/restaurants/{restaurantId}/dishes
 * Backend expects multipart/form-data with @RequestPart("dish") JSON and optional @RequestPart("image") file
 */
export const createDish = async (
	restaurantId: number,
	data: Omit<Dish, "id" | "restaurantId" | "restaurantName">,
	imageFile?: File | null,
): Promise<Dish> => {
	const formData = new FormData();
	// Backend expects @RequestPart("dish") as JSON blob
	formData.append(
		"dish",
		new Blob([JSON.stringify(data)], { type: "application/json" }),
	);
	// Add image file if provided
	if (imageFile) {
		formData.append("image", imageFile);
	}
	return apiClient.post<Dish>(`/admin/restaurants/${restaurantId}/dishes`, formData);
};

/**
 * API: Update dish
 * PUT /admin/dishes/{dishId}
 * Backend expects multipart/form-data with @RequestPart("dish") JSON and optional @RequestPart("image") file
 * Note: restaurantId is not used in the URL but kept for API consistency
 */
export const updateDish = async (
	_restaurantId: number,
	dishId: number,
	data: Partial<Omit<Dish, "id" | "restaurantId" | "restaurantName">>,
	imageFile?: File | null,
): Promise<Dish> => {
	const formData = new FormData();
	// Backend expects @RequestPart("dish") as JSON blob
	formData.append(
		"dish",
		new Blob([JSON.stringify(data)], { type: "application/json" }),
	);
	// Add image file if provided
	if (imageFile) {
		formData.append("image", imageFile);
	}
	return apiClient.put<Dish>(`/admin/dishes/${dishId}`, formData);
};

/**
 * API: Delete dish
 * DELETE /admin/dishes/{dishId}
 * Note: restaurantId is not used in the URL but kept for API consistency
 */
export const deleteDish = async (
	_restaurantId: number,
	dishId: number,
): Promise<void> => {
	return apiClient.delete<void>(`/admin/dishes/${dishId}`);
};
