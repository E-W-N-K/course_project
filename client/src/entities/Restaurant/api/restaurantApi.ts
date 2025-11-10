import { apiClient } from "@/shared/api/client";
import type { Restaurant } from "../types";

/**
 * API: Get all restaurants
 * GET /restaurants
 */
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
	return apiClient.get<Restaurant[]>("/restaurants");
};

/**
 * API: Get single restaurant by ID
 * Helper function - fetches all and filters by ID
 */
export const getRestaurantById = async (
	id: number,
): Promise<Restaurant | null> => {
	const restaurants = await getAllRestaurants();
	return restaurants.find((r) => r.id === id) || null;
};

/**
 * API: Search restaurants by name
 * GET /restaurants/searchRestaurant?name={name}
 */
export const searchRestaurants = async (name: string): Promise<Restaurant[]> => {
	if (!name.trim()) {
		return getAllRestaurants();
	}
	return apiClient.get<Restaurant[]>(`/restaurants/searchRestaurant?name=${encodeURIComponent(name)}`);
};

/**
 * API: Create new restaurant
 * POST /admin/restaurants
 * Backend expects multipart/form-data with @RequestPart("restaurant") JSON and optional @RequestPart("image") file
 */
export const createRestaurant = async (
	data: Omit<Restaurant, "id">,
	imageFile?: File | null,
): Promise<Restaurant> => {
	const formData = new FormData();
	// Backend expects @RequestPart("restaurant") as JSON blob
	formData.append(
		"restaurant",
		new Blob([JSON.stringify(data)], { type: "application/json" }),
	);
	// Add image file if provided
	if (imageFile) {
		formData.append("image", imageFile);
	}
	return apiClient.post<Restaurant>("/admin/restaurants", formData);
};

/**
 * API: Update restaurant
 * PUT /admin/restaurants/{id}
 * Backend expects multipart/form-data with @RequestPart("restaurant") JSON and optional @RequestPart("image") file
 */
export const updateRestaurant = async (
	id: number,
	data: Partial<Omit<Restaurant, "id">>,
	imageFile?: File | null,
): Promise<Restaurant> => {
	const formData = new FormData();
	// Backend expects @RequestPart("restaurant") as JSON blob
	formData.append(
		"restaurant",
		new Blob([JSON.stringify(data)], { type: "application/json" }),
	);
	// Add image file if provided
	if (imageFile) {
		formData.append("image", imageFile);
	}
	return apiClient.put<Restaurant>(`/admin/restaurants/${id}`, formData);
};

/**
 * API: Delete restaurant
 * DELETE /admin/restaurants/{id}
 */
export const deleteRestaurant = async (id: number): Promise<void> => {
	return apiClient.delete<void>(`/admin/restaurants/${id}`);
};
