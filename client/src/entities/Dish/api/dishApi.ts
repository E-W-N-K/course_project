import type { Dish } from "../types";

const DISHES_KEY = "food_delivery_dishes";

// Simulate network delay
const delay = (ms: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Initialize default mock dishes
 * 5-10 dishes per restaurant (total 70 dishes)
 */
const getDefaultDishes = (): Dish[] => {
	return [
		// Bella Italia (Restaurant ID: 1) - Italian Pizza & Pasta
		{
			id: 1,
			name: "Margherita Pizza",
			description:
				"Classic pizza with fresh mozzarella, tomato sauce, and basil on a wood-fired crust",
			url: "https://lipsum.app/id/101/400x300",
			price: 14.99,
			weight: 350,
			restaurantId: 1,
		},
		{
			id: 2,
			name: "Pepperoni Pizza",
			description:
				"Loaded with premium pepperoni and melted mozzarella cheese",
			url: "https://lipsum.app/id/102/400x300",
			price: 16.99,
			weight: 380,
			restaurantId: 1,
		},
		{
			id: 3,
			name: "Spaghetti Carbonara",
			description:
				"Creamy pasta with pancetta, eggs, parmesan, and black pepper",
			url: "https://lipsum.app/id/103/400x300",
			price: 15.99,
			weight: 320,
			restaurantId: 1,
		},
		{
			id: 4,
			name: "Lasagna Bolognese",
			description:
				"Layers of pasta with rich meat sauce, béchamel, and cheese",
			url: "https://lipsum.app/id/104/400x300",
			price: 17.99,
			weight: 400,
			restaurantId: 1,
		},
		{
			id: 5,
			name: "Caprese Salad",
			description:
				"Fresh mozzarella, tomatoes, basil, and balsamic glaze",
			url: "https://lipsum.app/id/105/400x300",
			price: 10.99,
			weight: 250,
			restaurantId: 1,
		},
		{
			id: 6,
			name: "Tiramisu",
			description:
				"Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
			url: "https://lipsum.app/id/106/400x300",
			price: 8.99,
			weight: 180,
			restaurantId: 1,
		},

		// Marco's Trattoria (Restaurant ID: 2) - Italian Traditional
		{
			id: 7,
			name: "Homemade Ravioli",
			description:
				"Fresh pasta filled with ricotta and spinach in sage butter sauce",
			url: "https://lipsum.app/id/107/400x300",
			price: 18.99,
			weight: 300,
			restaurantId: 2,
		},
		{
			id: 8,
			name: "Osso Buco",
			description:
				"Braised veal shanks in white wine with gremolata and risotto",
			url: "https://lipsum.app/id/108/400x300",
			price: 28.99,
			weight: 450,
			restaurantId: 2,
		},
		{
			id: 9,
			name: "Fettuccine Alfredo",
			description: "Creamy parmesan sauce tossed with fresh fettuccine pasta",
			url: "https://lipsum.app/id/109/400x300",
			price: 16.99,
			weight: 330,
			restaurantId: 2,
		},
		{
			id: 10,
			name: "Bruschetta",
			description:
				"Toasted bread topped with fresh tomatoes, garlic, and basil",
			url: "https://lipsum.app/id/110/400x300",
			price: 9.99,
			weight: 200,
			restaurantId: 2,
		},
		{
			id: 11,
			name: "Panna Cotta",
			description: "Silky vanilla custard with mixed berry compote",
			url: "https://lipsum.app/id/111/400x300",
			price: 7.99,
			weight: 150,
			restaurantId: 2,
		},

		// Sakura Sushi (Restaurant ID: 3) - Japanese Sushi
		{
			id: 12,
			name: "California Roll",
			description:
				"Crab, avocado, and cucumber wrapped in rice and seaweed",
			url: "https://lipsum.app/id/112/400x300",
			price: 12.99,
			weight: 220,
			restaurantId: 3,
		},
		{
			id: 13,
			name: "Spicy Tuna Roll",
			description: "Fresh tuna with spicy mayo, cucumber, and sesame seeds",
			url: "https://lipsum.app/id/113/400x300",
			price: 14.99,
			weight: 230,
			restaurantId: 3,
		},
		{
			id: 14,
			name: "Salmon Nigiri",
			description: "Fresh salmon slices on seasoned sushi rice (6 pieces)",
			url: "https://lipsum.app/id/114/400x300",
			price: 11.99,
			weight: 180,
			restaurantId: 3,
		},
		{
			id: 15,
			name: "Dragon Roll",
			description:
				"Shrimp tempura topped with eel, avocado, and sweet sauce",
			url: "https://lipsum.app/id/115/400x300",
			price: 16.99,
			weight: 260,
			restaurantId: 3,
		},
		{
			id: 16,
			name: "Miso Soup",
			description: "Traditional Japanese soup with tofu, seaweed, and scallions",
			url: "https://lipsum.app/id/116/400x300",
			price: 4.99,
			weight: 300,
			restaurantId: 3,
		},
		{
			id: 17,
			name: "Edamame",
			description: "Steamed soybeans with sea salt",
			url: "https://lipsum.app/id/117/400x300",
			price: 5.99,
			weight: 180,
			restaurantId: 3,
		},
		{
			id: 18,
			name: "Sashimi Platter",
			description:
				"Assorted fresh fish slices: salmon, tuna, and yellowtail",
			url: "https://lipsum.app/id/118/400x300",
			price: 24.99,
			weight: 200,
			restaurantId: 3,
		},

		// Golden Dragon (Restaurant ID: 4) - Chinese
		{
			id: 19,
			name: "Sweet & Sour Chicken",
			description:
				"Crispy chicken with bell peppers in tangy sweet and sour sauce",
			url: "https://lipsum.app/id/119/400x300",
			price: 13.99,
			weight: 350,
			restaurantId: 4,
		},
		{
			id: 20,
			name: "Kung Pao Chicken",
			description: "Spicy stir-fried chicken with peanuts and vegetables",
			url: "https://lipsum.app/id/120/400x300",
			price: 14.99,
			weight: 330,
			restaurantId: 4,
		},
		{
			id: 21,
			name: "Beef & Broccoli",
			description: "Tender beef slices with broccoli in savory brown sauce",
			url: "https://lipsum.app/id/121/400x300",
			price: 15.99,
			weight: 360,
			restaurantId: 4,
		},
		{
			id: 22,
			name: "Fried Rice",
			description: "Egg fried rice with vegetables, peas, and carrots",
			url: "https://lipsum.app/id/122/400x300",
			price: 10.99,
			weight: 400,
			restaurantId: 4,
		},
		{
			id: 23,
			name: "Spring Rolls",
			description: "Crispy vegetable spring rolls with sweet chili sauce",
			url: "https://lipsum.app/id/123/400x300",
			price: 6.99,
			weight: 200,
			restaurantId: 4,
		},
		{
			id: 24,
			name: "Dumplings",
			description: "Steamed pork dumplings with soy dipping sauce (8 pieces)",
			url: "https://lipsum.app/id/124/400x300",
			price: 8.99,
			weight: 240,
			restaurantId: 4,
		},
		{
			id: 25,
			name: "Mapo Tofu",
			description: "Spicy Szechuan tofu with ground pork and chili oil",
			url: "https://lipsum.app/id/125/400x300",
			price: 12.99,
			weight: 320,
			restaurantId: 4,
		},

		// Big Ben Burgers (Restaurant ID: 5) - American Burgers
		{
			id: 26,
			name: "Classic Cheeseburger",
			description:
				"Grass-fed beef patty with cheddar, lettuce, tomato, and special sauce",
			url: "https://lipsum.app/id/126/400x300",
			price: 12.99,
			weight: 320,
			restaurantId: 5,
		},
		{
			id: 27,
			name: "BBQ Bacon Burger",
			description:
				"Beef patty topped with crispy bacon, BBQ sauce, and onion rings",
			url: "https://lipsum.app/id/127/400x300",
			price: 14.99,
			weight: 380,
			restaurantId: 5,
		},
		{
			id: 28,
			name: "Mushroom Swiss Burger",
			description:
				"Beef patty with sautéed mushrooms and melted Swiss cheese",
			url: "https://lipsum.app/id/128/400x300",
			price: 13.99,
			weight: 340,
			restaurantId: 5,
		},
		{
			id: 29,
			name: "Veggie Burger",
			description:
				"House-made plant-based patty with avocado and sprouts",
			url: "https://lipsum.app/id/129/400x300",
			price: 11.99,
			weight: 300,
			restaurantId: 5,
		},
		{
			id: 30,
			name: "Hand-Cut Fries",
			description: "Crispy potato fries seasoned with sea salt",
			url: "https://lipsum.app/id/130/400x300",
			price: 5.99,
			weight: 250,
			restaurantId: 5,
		},
		{
			id: 31,
			name: "Onion Rings",
			description: "Beer-battered onion rings with ranch dipping sauce",
			url: "https://lipsum.app/id/131/400x300",
			price: 6.99,
			weight: 220,
			restaurantId: 5,
		},

		// Smokey's BBQ Pit (Restaurant ID: 6) - American BBQ
		{
			id: 32,
			name: "Smoked Brisket",
			description:
				"12-hour slow-smoked Texas-style brisket with BBQ sauce",
			url: "https://lipsum.app/id/132/400x300",
			price: 19.99,
			weight: 400,
			restaurantId: 6,
		},
		{
			id: 33,
			name: "Baby Back Ribs",
			description: "Fall-off-the-bone ribs with house-made BBQ glaze",
			url: "https://lipsum.app/id/133/400x300",
			price: 22.99,
			weight: 450,
			restaurantId: 6,
		},
		{
			id: 34,
			name: "Pulled Pork Sandwich",
			description:
				"Slow-roasted pulled pork with coleslaw on a brioche bun",
			url: "https://lipsum.app/id/134/400x300",
			price: 13.99,
			weight: 350,
			restaurantId: 6,
		},
		{
			id: 35,
			name: "Smoked Chicken",
			description: "Half chicken smoked to perfection with hickory wood",
			url: "https://lipsum.app/id/135/400x300",
			price: 16.99,
			weight: 380,
			restaurantId: 6,
		},
		{
			id: 36,
			name: "Mac & Cheese",
			description: "Creamy smoked cheddar mac and cheese",
			url: "https://lipsum.app/id/136/400x300",
			price: 7.99,
			weight: 280,
			restaurantId: 6,
		},
		{
			id: 37,
			name: "Cornbread",
			description: "Sweet cornbread with honey butter",
			url: "https://lipsum.app/id/137/400x300",
			price: 4.99,
			weight: 150,
			restaurantId: 6,
		},
		{
			id: 38,
			name: "Baked Beans",
			description: "Slow-cooked beans with bacon and molasses",
			url: "https://lipsum.app/id/138/400x300",
			price: 5.99,
			weight: 250,
			restaurantId: 6,
		},

		// El Mariachi (Restaurant ID: 7) - Mexican
		{
			id: 39,
			name: "Street Tacos",
			description:
				"Three soft corn tortillas with carne asada, cilantro, and onions",
			url: "https://lipsum.app/id/139/400x300",
			price: 11.99,
			weight: 270,
			restaurantId: 7,
		},
		{
			id: 40,
			name: "Enchiladas Verdes",
			description:
				"Chicken enchiladas topped with tomatillo sauce and cheese",
			url: "https://lipsum.app/id/140/400x300",
			price: 14.99,
			weight: 350,
			restaurantId: 7,
		},
		{
			id: 41,
			name: "Carne Asada",
			description:
				"Grilled steak with rice, beans, and fresh tortillas",
			url: "https://lipsum.app/id/141/400x300",
			price: 18.99,
			weight: 420,
			restaurantId: 7,
		},
		{
			id: 42,
			name: "Guacamole & Chips",
			description: "Fresh avocado dip with crispy tortilla chips",
			url: "https://lipsum.app/id/142/400x300",
			price: 8.99,
			weight: 300,
			restaurantId: 7,
		},
		{
			id: 43,
			name: "Quesadilla",
			description:
				"Grilled flour tortilla with melted cheese and choice of filling",
			url: "https://lipsum.app/id/143/400x300",
			price: 10.99,
			weight: 320,
			restaurantId: 7,
		},
		{
			id: 44,
			name: "Churros",
			description: "Fried dough pastries with cinnamon sugar and chocolate sauce",
			url: "https://lipsum.app/id/144/400x300",
			price: 6.99,
			weight: 180,
			restaurantId: 7,
		},

		// Casa Burrito (Restaurant ID: 8) - Tex-Mex
		{
			id: 45,
			name: "Monster Burrito",
			description:
				"Huge burrito with rice, beans, meat, cheese, and salsa",
			url: "https://lipsum.app/id/145/400x300",
			price: 13.99,
			weight: 500,
			restaurantId: 8,
		},
		{
			id: 46,
			name: "Chicken Fajitas",
			description:
				"Sizzling chicken with peppers, onions, and warm tortillas",
			url: "https://lipsum.app/id/146/400x300",
			price: 16.99,
			weight: 400,
			restaurantId: 8,
		},
		{
			id: 47,
			name: "Beef Nachos",
			description:
				"Crispy chips loaded with beef, cheese, jalapeños, and sour cream",
			url: "https://lipsum.app/id/147/400x300",
			price: 12.99,
			weight: 380,
			restaurantId: 8,
		},
		{
			id: 48,
			name: "Taco Salad",
			description:
				"Crispy tortilla bowl with lettuce, beef, cheese, and salsa",
			url: "https://lipsum.app/id/148/400x300",
			price: 11.99,
			weight: 350,
			restaurantId: 8,
		},
		{
			id: 49,
			name: "Chips & Salsa",
			description: "House-made tortilla chips with fresh salsa trio",
			url: "https://lipsum.app/id/149/400x300",
			price: 5.99,
			weight: 250,
			restaurantId: 8,
		},
		{
			id: 50,
			name: "Tres Leches Cake",
			description: "Traditional three-milk sponge cake",
			url: "https://lipsum.app/id/150/400x300",
			price: 7.99,
			weight: 200,
			restaurantId: 8,
		},

		// Olive Grove (Restaurant ID: 9) - Greek/Mediterranean
		{
			id: 51,
			name: "Gyro Plate",
			description:
				"Lamb and beef gyro with tzatziki, rice, and Greek salad",
			url: "https://lipsum.app/id/151/400x300",
			price: 15.99,
			weight: 400,
			restaurantId: 9,
		},
		{
			id: 52,
			name: "Moussaka",
			description:
				"Layered eggplant, potatoes, and meat sauce with béchamel",
			url: "https://lipsum.app/id/152/400x300",
			price: 17.99,
			weight: 380,
			restaurantId: 9,
		},
		{
			id: 53,
			name: "Greek Salad",
			description:
				"Fresh tomatoes, cucumbers, olives, feta, and olive oil",
			url: "https://lipsum.app/id/153/400x300",
			price: 10.99,
			weight: 300,
			restaurantId: 9,
		},
		{
			id: 54,
			name: "Mezze Platter",
			description: "Hummus, baba ganoush, tzatziki, and warm pita bread",
			url: "https://lipsum.app/id/154/400x300",
			price: 14.99,
			weight: 350,
			restaurantId: 9,
		},
		{
			id: 55,
			name: "Grilled Octopus",
			description: "Tender octopus with lemon, olive oil, and herbs",
			url: "https://lipsum.app/id/155/400x300",
			price: 22.99,
			weight: 280,
			restaurantId: 9,
		},
		{
			id: 56,
			name: "Spanakopita",
			description: "Phyllo pastry filled with spinach and feta cheese",
			url: "https://lipsum.app/id/156/400x300",
			price: 9.99,
			weight: 220,
			restaurantId: 9,
		},
		{
			id: 57,
			name: "Baklava",
			description: "Sweet pastry with honey, nuts, and phyllo layers",
			url: "https://lipsum.app/id/157/400x300",
			price: 6.99,
			weight: 150,
			restaurantId: 9,
		},

		// Taste of Lebanon (Restaurant ID: 10) - Middle Eastern
		{
			id: 58,
			name: "Chicken Shawarma",
			description:
				"Marinated chicken wrapped in pita with garlic sauce and vegetables",
			url: "https://lipsum.app/id/158/400x300",
			price: 12.99,
			weight: 350,
			restaurantId: 10,
		},
		{
			id: 59,
			name: "Beef Shawarma Plate",
			description:
				"Spiced beef with rice, hummus, and grilled vegetables",
			url: "https://lipsum.app/id/159/400x300",
			price: 16.99,
			weight: 420,
			restaurantId: 10,
		},
		{
			id: 60,
			name: "Falafel Wrap",
			description:
				"Crispy chickpea fritters with tahini sauce in warm pita",
			url: "https://lipsum.app/id/160/400x300",
			price: 10.99,
			weight: 300,
			restaurantId: 10,
		},
		{
			id: 61,
			name: "Hummus Bowl",
			description:
				"Creamy chickpea dip topped with olive oil and warm pita",
			url: "https://lipsum.app/id/161/400x300",
			price: 8.99,
			weight: 280,
			restaurantId: 10,
		},
		{
			id: 62,
			name: "Tabbouleh Salad",
			description:
				"Fresh parsley salad with bulgur, tomatoes, and lemon dressing",
			url: "https://lipsum.app/id/162/400x300",
			price: 9.99,
			weight: 250,
			restaurantId: 10,
		},
		{
			id: 63,
			name: "Lamb Kebab",
			description:
				"Grilled lamb skewers with rice and grilled vegetables",
			url: "https://lipsum.app/id/163/400x300",
			price: 19.99,
			weight: 380,
			restaurantId: 10,
		},
		{
			id: 64,
			name: "Baba Ganoush",
			description: "Smoky eggplant dip with tahini and garlic",
			url: "https://lipsum.app/id/164/400x300",
			price: 8.99,
			weight: 260,
			restaurantId: 10,
		},
		{
			id: 65,
			name: "Kunafa",
			description:
				"Sweet cheese pastry soaked in syrup and topped with pistachios",
			url: "https://lipsum.app/id/165/400x300",
			price: 7.99,
			weight: 180,
			restaurantId: 10,
		},
	];
};

/**
 * Get all dishes from localStorage or initialize with defaults
 */
const getDishes = (): Dish[] => {
	const stored = localStorage.getItem(DISHES_KEY);
	if (stored) {
		return JSON.parse(stored);
	}

	const defaultDishes = getDefaultDishes();
	localStorage.setItem(DISHES_KEY, JSON.stringify(defaultDishes));
	return defaultDishes;
};

/**
 * Save dishes to localStorage
 * Will be used for admin operations (create/update/delete)
 */
// @ts-expect-error - Reserved for future admin operations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saveDishes = (dishes: Dish[]): void => {
	localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
};

/**
 * API: Get all dishes
 */
export const getAllDishes = async (): Promise<Dish[]> => {
	await delay();
	return getDishes();
};

/**
 * API: Get dishes by restaurant ID
 * Matches: GET /restaurants/{restaurantId}/dishes
 */
export const getDishesByRestaurant = async (
	restaurantId: number,
): Promise<Dish[]> => {
	await delay();
	const dishes = getDishes();
	return dishes.filter((d) => d.restaurantId === restaurantId);
};

/**
 * API: Get single dish by ID and restaurant ID
 * Matches: GET /restaurants/{restaurantId}/dishes/{dishId}
 */
export const getDishById = async (
	restaurantId: number,
	dishId: number,
): Promise<Dish | null> => {
	await delay();
	const dishes = getDishes();
	return (
		dishes.find((d) => d.id === dishId && d.restaurantId === restaurantId) ||
		null
	);
};

/**
 * API: Search dishes by name (across all restaurants)
 * Matches: GET /restaurants/searchDish?dishName={dishName}
 * For future implementation
 */
export const searchDishes = async (dishName: string): Promise<Dish[]> => {
	await delay();
	const dishes = getDishes();
	const searchTerm = dishName.toLowerCase().trim();

	if (!searchTerm) {
		return dishes;
	}

	return dishes.filter((d) => d.name.toLowerCase().includes(searchTerm));
};

/**
 * API: Search dishes by name in specific restaurant
 * Matches: GET /restaurants/{restaurantId}/dishes/searchDish?dishName={dishName}
 * For future implementation
 */
export const searchDishesInRestaurant = async (
	restaurantId: number,
	dishName: string,
): Promise<Dish[]> => {
	await delay();
	const dishes = getDishes();
	const searchTerm = dishName.toLowerCase().trim();

	const restaurantDishes = dishes.filter((d) => d.restaurantId === restaurantId);

	if (!searchTerm) {
		return restaurantDishes;
	}

	return restaurantDishes.filter((d) =>
		d.name.toLowerCase().includes(searchTerm),
	);
};
