import type { Restaurant } from "../types";

const RESTAURANTS_KEY = "food_delivery_restaurants";

// Simulate network delay
const delay = (ms: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Initialize default mock restaurants
 * 10 restaurants with mixed cuisines (Italian, Asian, American, Mexican, Mediterranean)
 */
const getDefaultRestaurants = (): Restaurant[] => {
	return [
		{
			id: 1,
			name: "Bella Italia",
			address: "123 Main Street, Downtown",
			phone: "+1 (555) 123-4501",
			description:
				"Authentic Italian cuisine featuring wood-fired pizzas, fresh pasta, and traditional recipes passed down through generations.",
			url: "https://lipsum.app/id/1/800x600",
		},
		{
			id: 2,
			name: "Marco's Trattoria",
			address: "456 Oak Avenue, Old Town",
			phone: "+1 (555) 123-4502",
			description:
				"Family-owned trattoria serving classic Italian dishes with a modern twist. Famous for our handmade ravioli and tiramisu.",
			url: "https://lipsum.app/id/2/800x600",
		},
		{
			id: 3,
			name: "Sakura Sushi",
			address: "789 Cherry Blossom Lane, Eastside",
			phone: "+1 (555) 123-4503",
			description:
				"Premium Japanese sushi restaurant with fresh fish daily. Experience traditional Edo-style sushi and contemporary rolls.",
			url: "https://lipsum.app/id/3/800x600",
		},
		{
			id: 4,
			name: "Golden Dragon",
			address: "321 Bamboo Road, Chinatown",
			phone: "+1 (555) 123-4504",
			description:
				"Authentic Chinese cuisine and Asian fusion dishes. Specializing in dim sum, Szechuan, and Cantonese favorites.",
			url: "https://lipsum.app/id/4/800x600",
		},
		{
			id: 5,
			name: "Big Ben Burgers",
			address: "654 Liberty Street, Westside",
			phone: "+1 (555) 123-4505",
			description:
				"Gourmet burgers made with premium grass-fed beef. Craft beers and hand-cut fries in a casual atmosphere.",
			url: "https://lipsum.app/id/5/800x600",
		},
		{
			id: 6,
			name: "Smokey's BBQ Pit",
			address: "987 Hickory Lane, Southside",
			phone: "+1 (555) 123-4506",
			description:
				"Texas-style BBQ with slow-smoked brisket, ribs, and pulled pork. Family recipes and homemade sides.",
			url: "https://lipsum.app/id/6/800x600",
		},
		{
			id: 7,
			name: "El Mariachi",
			address: "147 Sunset Boulevard, Plaza District",
			phone: "+1 (555) 123-4507",
			description:
				"Vibrant Mexican restaurant featuring tacos, enchiladas, and fresh margaritas. Live mariachi on weekends.",
			url: "https://lipsum.app/id/7/800x600",
		},
		{
			id: 8,
			name: "Casa Burrito",
			address: "258 Mesa Drive, Northside",
			phone: "+1 (555) 123-4508",
			description:
				"Tex-Mex specialties with huge burritos, sizzling fajitas, and homemade guacamole. Fast, fresh, and flavorful.",
			url: "https://lipsum.app/id/8/800x600",
		},
		{
			id: 9,
			name: "Olive Grove",
			address: "369 Mediterranean Way, Harbor District",
			phone: "+1 (555) 123-4509",
			description:
				"Greek and Mediterranean cuisine with fresh seafood, grilled meats, and traditional mezze platters.",
			url: "https://lipsum.app/id/9/800x600",
		},
		{
			id: 10,
			name: "Taste of Lebanon",
			address: "741 Cedar Street, University District",
			phone: "+1 (555) 123-4510",
			description:
				"Authentic Lebanese restaurant offering shawarma, falafel, and mezze. Fresh ingredients and family atmosphere.",
			url: "https://lipsum.app/id/10/800x600",
		},
	];
};

/**
 * Get all restaurants from localStorage or initialize with defaults
 */
const getRestaurants = (): Restaurant[] => {
	const stored = localStorage.getItem(RESTAURANTS_KEY);
	if (stored) {
		return JSON.parse(stored);
	}

	const defaultRestaurants = getDefaultRestaurants();
	localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(defaultRestaurants));
	return defaultRestaurants;
};

/**
 * Save restaurants to localStorage
 * Will be used for admin operations (create/update/delete)
 */
// @ts-expect-error - Reserved for future admin operations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saveRestaurants = (restaurants: Restaurant[]): void => {
	localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(restaurants));
};

/**
 * API: Get all restaurants
 * Matches: GET /restaurants
 */
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
	await delay();
	return getRestaurants();
};

/**
 * API: Get single restaurant by ID
 * Helper function for future use
 */
export const getRestaurantById = async (
	id: number,
): Promise<Restaurant | null> => {
	await delay();
	const restaurants = getRestaurants();
	return restaurants.find((r) => r.id === id) || null;
};

/**
 * API: Search restaurants by name
 * Matches: GET /restaurants/searchRestaurant?name={name}
 * For future implementation
 */
export const searchRestaurants = async (name: string): Promise<Restaurant[]> => {
	await delay();
	const restaurants = getRestaurants();
	const searchTerm = name.toLowerCase().trim();

	if (!searchTerm) {
		return restaurants;
	}

	return restaurants.filter((r) =>
		r.name.toLowerCase().includes(searchTerm),
	);
};
