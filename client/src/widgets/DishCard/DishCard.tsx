import type { Dish } from "@/entities/Dish";
import { UICard, UIButton } from "@/shared/ui";
import styles from "./DishCard.module.css";

interface DishCardProps {
	dish: Dish;
}

export const DishCard = ({ dish }: DishCardProps) => {
	return (
		<UICard className={styles["dish-card"]} padding="lg">
			<div className={styles["dish-card__wrapper"]}>
				<div className={styles["dish-card__image-wrapper"]}>
					<img
						src={dish.url}
						alt={dish.name}
						className={styles["dish-card__image"]}
					/>
				</div>

				<div className={styles["dish-card__content"]}>
					<div className={styles["dish-card__header"]}>
						<h3 className={styles["dish-card__name"]}>{dish.name}</h3>
						<div className={styles["dish-card__meta"]}>
							<span className={styles["dish-card__price"]}>
								${dish.price.toFixed(2)}
							</span>
							<span className={styles["dish-card__weight"]}>{dish.weight}g</span>
						</div>
					</div>

					{dish.description && (
						<p className={styles["dish-card__description"]}>
							{dish.description}
						</p>
					)}

					<div className={styles["dish-card__footer"]}>
						<UIButton
							variant="solid"
							colorType="primary"
							disabled={true}
							className={styles["dish-card__add-button"]}
						>
							Add to Cart
						</UIButton>
					</div>
				</div>
			</div>
		</UICard>
	);
};
