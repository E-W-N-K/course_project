import { useState, useEffect, useRef, useCallback } from "react";
import type { Restaurant } from "@/entities/Restaurant";
import type { Dish } from "@/entities/Dish";
import { restaurantApi } from "@/entities/Restaurant";
import { dishApi } from "@/entities/Dish";
import { useUserStore } from "@/entities/User";
import {
	UIContainer,
	UISearchInput,
	UIButton,
	UICard,
	UISection,
} from "@/shared/ui";
import { RestaurantCard } from "@/widgets/RestaurantCard";
import { DishCard } from "@/widgets/DishCard";
import {
	EditRestaurantForm,
	type EditRestaurantFormRef,
} from "@/features/Admin/EditRestaurantForm";
import { useDebounce } from "@/shared/lib/hooks";
import styles from "./HomePage.module.css";

interface SearchResults {
	restaurants: Restaurant[];
	dishes: Dish[];
}

export const HomePage = () => {
	const user = useUserStore((state) => state.user);
	const isAdmin = user?.role === "ADMIN";

	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResults>({
		restaurants: [],
		dishes: [],
	});
	const [isSearching, setIsSearching] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const addRestaurantFormRef = useRef<EditRestaurantFormRef>(null);
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	// Fetch data based on search query
	const fetchData = useCallback(async () => {
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
	}, [debouncedSearchQuery]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddRestaurant = () => {
		addRestaurantFormRef.current?.open();
	};

	const handleRestaurantSuccess = () => {
		fetchData();
	};

	const hasResults =
		searchResults.restaurants.length > 0 || searchResults.dishes.length > 0;
	const isSearchActive = debouncedSearchQuery.trim() !== "";

	return (
		<UISection>
			<UIContainer className={styles["home-page"]}>
				<div className={styles["home-page__header"]}>
					<div className={styles["home-page__header-text"]}>
						<h1 className={styles["home-page__title"]}>
							Food Delivery Platform
						</h1>
						<p className={styles["home-page__subtitle"]}>
							Discover amazing restaurants in your area
						</p>
					</div>
					{isAdmin && (
						<UIButton
							variant="solid"
							colorType="primary"
							onClick={handleAddRestaurant}
						>
							Add Restaurant
						</UIButton>
					)}
				</div>

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
								<div className="grid">
									{searchResults.restaurants.map((restaurant) => (
										<RestaurantCard
											key={restaurant.id}
											restaurant={restaurant}
										/>
									))}
								</div>
							</div>
						)}

						{/* Dishes Section */}
						{searchResults.dishes.length > 0 && (
							<div className={styles["home-page__section"]}>
								<h2 className={styles["home-page__section-title"]}>
									Dishes ({searchResults.dishes.length})
								</h2>
								<div className="grid grid--lg">
									{searchResults.dishes.map((dish) => (
										<DishCard key={dish.id} dish={dish} onUpdate={fetchData} />
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Admin Dialogs */}
				{isAdmin && (
					<EditRestaurantForm
						ref={addRestaurantFormRef}
						onSuccess={handleRestaurantSuccess}
					/>
				)}
			</UIContainer>
		</UISection>
	);
};
