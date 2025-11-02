import { useState } from "react";
import { useCartStore } from "@/entities/Cart";
import { useUserStore } from "@/entities/User";
import { UIButton } from "@/shared/ui/UIButton";

interface AddToCartProps {
	dishId: number;
	quantity?: number;
	variant?: "solid" | "outline";
	colorType?: "primary" | "secondary" | "danger";
	fullWidth?: boolean;
	disabled?: boolean;
}

export const AddToCart = ({
	dishId,
	quantity = 1,
	variant = "solid",
	colorType = "primary",
	fullWidth = false,
	disabled = false,
}: AddToCartProps) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const [isAdding, setIsAdding] = useState(false);

	const handleAddToCart = async () => {
		if (!user) {
			console.error("User not authenticated");
			return;
		}

		setIsAdding(true);
		try {
			await addToCart(user.id, dishId, quantity);
		} catch (error) {
			console.error("Failed to add to cart:", error);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<UIButton
			variant={variant}
			colorType={colorType}
			fullWidth={fullWidth}
			disabled={disabled || isAdding || !user}
			onClick={handleAddToCart}
		>
			{isAdding ? "Adding..." : "Add to Cart"}
		</UIButton>
	);
};
