import { Link } from "react-router-dom";
import type { Restaurant } from "@/entities/Restaurant";
import { UICard } from "@/shared/ui";
import { buildImageUrl } from "@/shared/lib";
import styles from "./RestaurantCard.module.css";

interface RestaurantCardProps {
	restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
	return (
		<Link
			to={`/restaurants/${restaurant.id}`}
			className={styles["restaurant-card__link"]}
		>
			<UICard className={styles["restaurant-card"]}>
				<img
					src={buildImageUrl(restaurant.url)}
					alt={restaurant.name}
					className={styles["restaurant-card__image"]}
				/>
				<div className={styles["restaurant-card__content"]}>
					<h3 className={styles["restaurant-card__name"]}>{restaurant.name}</h3>
					<p className={styles["restaurant-card__address"]}>
						{restaurant.address}
					</p>
				</div>
			</UICard>
		</Link>
	);
};
