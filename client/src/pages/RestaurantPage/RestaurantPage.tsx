import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Restaurant } from "@/entities/Restaurant";
import type { Dish } from "@/entities/Dish";
import { restaurantApi } from "@/entities/Restaurant";
import { dishApi } from "@/entities/Dish";
import { UIContainer } from "@/shared/ui";
import { DishCard } from "@/widgets/DishCard";
import styles from "./RestaurantPage.module.css";

export const RestaurantPage = () => {
	const { id } = useParams<{ id: string }>();
	const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
	const [dishes, setDishes] = useState<Dish[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				setError("Restaurant ID is missing");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError("");

				const restaurantId = Number(id);

				// Fetch restaurant and dishes in parallel
				const [restaurantData, dishesData] = await Promise.all([
					restaurantApi.getRestaurantById(restaurantId),
					dishApi.getDishesByRestaurant(restaurantId),
				]);

				if (!restaurantData) {
					setError("Restaurant not found");
					setIsLoading(false);
					return;
				}

				setRestaurant(restaurantData);
				setDishes(dishesData);
			} catch (err) {
				console.error("Failed to fetch restaurant data:", err);
				setError("Failed to load restaurant. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (isLoading) {
		return (
			<UIContainer>
				<p className={styles["restaurant-page__loading"]}>
					Loading restaurant...
				</p>
			</UIContainer>
		);
	}

	if (error || !restaurant) {
		return (
			<UIContainer>
				<div className={styles["restaurant-page__error"]}>
					<h1>Error</h1>
					<p>{error || "Restaurant not found"}</p>
				</div>
			</UIContainer>
		);
	}

	return (
		<div className={styles["restaurant-page"]}>
			{/* Full-width hero banner */}
			<div className={styles["restaurant-page__hero"]}>
				<div
					className={styles["restaurant-page__hero-image"]}
					style={{ backgroundImage: `url(${restaurant.url})` }}
					role="img"
					aria-label={`${restaurant.name} banner`}
				/>
			</div>

			{/* Restaurant info and menu */}
			<UIContainer>
				<div className={styles["restaurant-page__info"]}>
					<h1 className={styles["restaurant-page__title"]}>{restaurant.name}</h1>
					<p className={styles["restaurant-page__description"]}>
						{restaurant.description}
					</p>
					<div className={styles["restaurant-page__details"]}>
						<p className={styles["restaurant-page__detail"]}>
							<strong>Address:</strong> {restaurant.address}
						</p>
						<p className={styles["restaurant-page__detail"]}>
							<strong>Phone:</strong> {restaurant.phone}
						</p>
					</div>
				</div>

				<div className={styles["restaurant-page__menu"]}>
					<h2 className={styles["restaurant-page__menu-title"]}>Menu</h2>

					{dishes.length === 0 ? (
						<p className={styles["restaurant-page__no-dishes"]}>
							No menu items available at this time.
						</p>
					) : (
						<div className={styles["restaurant-page__dishes"]}>
							{dishes.map((dish) => (
								<DishCard key={dish.id} dish={dish} />
							))}
						</div>
					)}
				</div>
			</UIContainer>
		</div>
	);
};
