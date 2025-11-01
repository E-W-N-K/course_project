import { useState, useEffect } from "react";
import type { Restaurant } from "@/entities/Restaurant";
import { restaurantApi } from "@/entities/Restaurant";
import { UIContainer, UIGrid } from "@/shared/ui";
import { RestaurantCard } from "@/widgets/RestaurantCard";
import styles from "./HomePage.module.css";

export const HomePage = () => {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				setIsLoading(true);
				const data = await restaurantApi.getAllRestaurants();
				setRestaurants(data);
			} catch (error) {
				console.error("Failed to fetch restaurants:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRestaurants();
	}, []);

	return (
		<UIContainer className={styles["home-page"]}>
			<h1 className={styles["home-page__title"]}>Food Delivery Platform</h1>
			<p className={styles["home-page__subtitle"]}>
				Discover amazing restaurants in your area
			</p>

			{isLoading ? (
				<p className={styles["home-page__loading"]}>Loading restaurants...</p>
			) : (
				<UIGrid columns={3} gap="xl">
					{restaurants.map((restaurant) => (
						<RestaurantCard key={restaurant.id} restaurant={restaurant} />
					))}
				</UIGrid>
			)}
		</UIContainer>
	);
};
