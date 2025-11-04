import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Restaurant } from "@/entities/Restaurant";
import type { Dish } from "@/entities/Dish";
import { restaurantApi } from "@/entities/Restaurant";
import { dishApi } from "@/entities/Dish";
import { UIContainer, UIGrid, UISearchInput, UIButton, UICard } from "@/shared/ui";
import { RestaurantCard } from "@/widgets/RestaurantCard";
import { DishCard } from "@/widgets/DishCard";
import { useDebounce } from "@/shared/lib/hooks";
import styles from "./HomePage.module.css";

interface SearchResults {
	restaurants: Restaurant[];
	dishes: Dish[];
}

export const HomePage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResults>({
		restaurants: [],
		dishes: [],
	});
	const [isSearching, setIsSearching] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	// Fetch data based on search query
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (debouncedSearchQuery.trim() === "") {
					// Empty search - show all restaurants
					setIsSearching(true);
					const restaurants = await restaurantApi.getAllRestaurants();
					setSearchResults({ restaurants, dishes: [] });
				} else {
					// Search query - call both APIs in parallel
					setIsSearching(true);
					const [restaurants, dishes] = await Promise.all([
						restaurantApi.searchRestaurants(debouncedSearchQuery),
						dishApi.searchDishes(debouncedSearchQuery),
					]);
					setSearchResults({ restaurants, dishes });
				}
			} catch (error) {
				console.error("Failed to fetch search results:", error);
			} finally {
				setIsSearching(false);
				setIsInitialLoading(false);
			}
		};

		fetchData();
	}, [debouncedSearchQuery]);

	const hasResults =
		searchResults.restaurants.length > 0 || searchResults.dishes.length > 0;
	const isSearchActive = debouncedSearchQuery.trim() !== "";

	return (
		<UIContainer className={styles["home-page"]}>
			<h1 className={styles["home-page__title"]}>Food Delivery Platform</h1>
			<p className={styles["home-page__subtitle"]}>
				Discover amazing restaurants in your area
			</p>

			{/* Search Input */}
			<div className={styles["home-page__search"]}>
				<UISearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="Search restaurants and dishes..."
				/>
			</div>

			{/* Loading State */}
			{isInitialLoading ? (
				<p className={styles["home-page__loading"]}>Loading restaurants...</p>
			) : isSearching ? (
				<p className={styles["home-page__loading"]}>Searching...</p>
			) : !hasResults && isSearchActive ? (
				/* No Results State */
				<div className={styles["home-page__no-results"]}>
					<UICard padding="xl">
						<div className={styles["home-page__no-results-content"]}>
							<h2 className={styles["home-page__no-results-title"]}>
								No results found for "{debouncedSearchQuery}"
							</h2>
							<p className={styles["home-page__no-results-text"]}>
								Try adjusting your search or browse all restaurants
							</p>
							<UIButton
								variant="solid"
								colorType="primary"
								onClick={() => setSearchQuery("")}
							>
								Clear Search
							</UIButton>
						</div>
					</UICard>
				</div>
			) : (
				/* Results */
				<div className={styles["home-page__results"]}>
					{/* Restaurants Section */}
					{searchResults.restaurants.length > 0 && (
						<div className={styles["home-page__section"]}>
							<h2 className={styles["home-page__section-title"]}>
								{isSearchActive
									? `Restaurants (${searchResults.restaurants.length})`
									: "Restaurants"}
							</h2>
							<UIGrid columns={3} gap="xl">
								{searchResults.restaurants.map((restaurant) => (
									<RestaurantCard key={restaurant.id} restaurant={restaurant} />
								))}
							</UIGrid>
						</div>
					)}

					{/* Dishes Section */}
					{searchResults.dishes.length > 0 && (
						<div className={styles["home-page__section"]}>
							<h2 className={styles["home-page__section-title"]}>
								Dishes ({searchResults.dishes.length})
							</h2>
							<UIGrid columns={2} gap="xl">
								{searchResults.dishes.map((dish) => (
									<Link
										key={dish.id}
										to={`/restaurants/${dish.restaurantId}`}
										style={{ textDecoration: "none", color: "inherit" }}
									>
										<DishCard dish={dish} />
									</Link>
								))}
							</UIGrid>
						</div>
					)}
				</div>
			)}
		</UIContainer>
	);
};
