import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { Restaurant } from "@/entities/Restaurant";
import type { Dish } from "@/entities/Dish";
import { restaurantApi } from "@/entities/Restaurant";
import { dishApi } from "@/entities/Dish";
import { useUserStore } from "@/entities/User";
import { UIContainer } from "@/shared/ui";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { DishCard } from "@/widgets/DishCard";
import {
	EditRestaurantForm,
	type EditRestaurantFormRef,
} from "@/features/Admin/EditRestaurantForm";
import {
	EditDishForm,
	type EditDishFormRef,
} from "@/features/Admin/EditDishForm";
import styles from "./RestaurantPage.module.css";

export const RestaurantPage = () => {
	const { id } = useParams<{ id: string }>();
	const user = useUserStore((state) => state.user);
	const isAdmin = user?.role === "ADMIN";

	const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
	const [dishes, setDishes] = useState<Dish[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string>("");

	const editRestaurantFormRef = useRef<EditRestaurantFormRef>(null);
	const addDishFormRef = useRef<EditDishFormRef>(null);

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

	useEffect(() => {
		fetchData();
	}, [id]);

	const handleEditRestaurant = () => {
		editRestaurantFormRef.current?.open();
	};

	const handleAddDish = () => {
		addDishFormRef.current?.open();
	};

	const handleRestaurantEditSuccess = () => {
		fetchData();
	};

	const handleDishSuccess = () => {
		fetchData();
	};

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
					<div className={styles["restaurant-page__header"]}>
						<h1 className={styles["restaurant-page__title"]}>{restaurant.name}</h1>
						{isAdmin && (
							<UIButton
								variant="outline"
								colorType="primary"
								onClick={handleEditRestaurant}
							>
								Edit Restaurant
							</UIButton>
						)}
					</div>
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
					<div className={styles["restaurant-page__menu-header"]}>
						<h2 className={styles["restaurant-page__menu-title"]}>Menu</h2>
						{isAdmin && (
							<UIButton
								variant="solid"
								colorType="primary"
								onClick={handleAddDish}
							>
								Add Dish
							</UIButton>
						)}
					</div>

					{dishes.length === 0 ? (
						<p className={styles["restaurant-page__no-dishes"]}>
							No menu items available at this time.
						</p>
					) : (
						<div className="grid grid--lg">
							{dishes.map((dish) => (
								<DishCard
									key={dish.id}
									dish={dish}
									restaurantId={restaurant.id}
									onUpdate={fetchData}
								/>
							))}
						</div>
					)}
				</div>
			</UIContainer>

			{/* Admin Dialogs */}
			{isAdmin && restaurant && (
				<>
					<EditRestaurantForm
						ref={editRestaurantFormRef}
						restaurant={restaurant}
						onSuccess={handleRestaurantEditSuccess}
					/>
					<EditDishForm
						ref={addDishFormRef}
						restaurantId={restaurant.id}
						onSuccess={handleDishSuccess}
					/>
				</>
			)}
		</div>
	);
};
