/**
 * Dish entity types
 * Based on DishDTO from backend
 */

export interface Dish {
	id: number;
	name: string;
	description?: string;
	url: string;
	price: number;
	weight: number;
	// Optional fields for search results
	restaurantId?: number;
	restaurantName?: string;
}