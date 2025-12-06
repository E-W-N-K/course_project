import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Restaurant } from "@/entities/Restaurant";
import type { Dish } from "@/entities/Dish";
import { restaurantApi } from "@/entities/Restaurant";
import { dishApi } from "@/entities/Dish";
import { useUserStore } from "@/entities/User";
import { UIContainer, UISection } from "@/shared/ui";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UISearchInput } from "@/shared/ui/UISearchInput/UISearchInput";
import { buildImageUrl } from "@/shared/lib";
import { DishCard } from "@/widgets/DishCard";
import { AdminRestaurantControls } from "@/features/Admin/AdminRestaurantControls";
import {
	EditDishForm,
	type EditDishFormRef,
} from "@/features/Admin/EditDishForm";
import styles from "./RestaurantPage.module.css";

export const RestaurantPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const user = useUserStore((state) => state.user);
	const isAdmin = user?.role === "ADMIN";

	const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
	const [dishes, setDishes] = useState<Dish[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState("");

	const addDishFormRef = useRef<EditDishFormRef>(null);

	// Filter dishes based on search query
	const filteredDishes = useMemo(() => {
		if (!searchQuery.trim()) {
			return dishes;
		}

		const query = searchQuery.toLowerCase();
		return dishes.filter(
			(dish) =>
				dish.name.toLowerCase().includes(query) ||
				dish.description?.toLowerCase().includes(query)
		);
	}, [dishes, searchQuery]);

	const fetchData = useCallback(async () => {
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
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddDish = () => {
		addDishFormRef.current?.open();
	};

	const handleDishSuccess = () => {
		fetchData();
	};

	const handleRestaurantDelete = () => {
		navigate("/");
	};

	if (isLoading) {
		return (
			<UISection>
				<UIContainer>
					<p className={styles["restaurant-page__loading"]}>
						Loading restaurant...
					</p>
				</UIContainer>
			</UISection>
		);
	}

	if (error || !restaurant) {
		return (
			<UISection>
				<UIContainer>
					<div className={styles["restaurant-page__error"]}>
						<h1>Error</h1>
						<p>{error || "Restaurant not found"}</p>
					</div>
				</UIContainer>
			</UISection>
		);
	}

	return (
		<div className={styles["restaurant-page"]}>
			{/* Full-width hero banner */}
			<div className={styles["restaurant-page__hero"]}>
				<div
					className={styles["restaurant-page__hero-image"]}
					style={{ backgroundImage: `url(${buildImageUrl(restaurant.url)})` }}
					role="img"
					aria-label={`${restaurant.name} banner`}
				/>
			</div>

			{/* Restaurant info and menu */}
			<UISection>
				<UIContainer>
					<div className={styles["restaurant-page__info"]}>
						<div className={styles["restaurant-page__header"]}>
							<h1 className={styles["restaurant-page__title"]}>
								{restaurant.name}
							</h1>
							{isAdmin && (
								<AdminRestaurantControls
									restaurant={restaurant}
									onUpdate={fetchData}
									onDelete={handleRestaurantDelete}
								/>
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

						{/* Search Bar */}
						{dishes.length > 0 && (
							<div className={styles["restaurant-page__search"]}>
								<UISearchInput
									value={searchQuery}
									onChange={setSearchQuery}
									placeholder="Search dishes by name or description..."
								/>
							</div>
						)}

						{dishes.length === 0 ? (
							<p className={styles["restaurant-page__no-dishes"]}>
								No menu items available at this time.
							</p>
						) : filteredDishes.length === 0 ? (
							<p className={styles["restaurant-page__no-dishes"]}>
								No dishes found matching "{searchQuery}".
							</p>
						) : (
							<div className="grid grid--lg">
								{filteredDishes.map((dish) => (
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
			</UISection>

			{/* Admin Dialogs */}
			{isAdmin && restaurant && (
				<EditDishForm
					ref={addDishFormRef}
					restaurantId={restaurant.id}
					onSuccess={handleDishSuccess}
				/>
			)}
		</div>
	);
};
