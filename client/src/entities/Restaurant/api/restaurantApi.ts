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
