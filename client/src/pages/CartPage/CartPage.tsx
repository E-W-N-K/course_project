import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { useCartStore } from "@/entities/Cart";
import { DishCard } from "@/widgets/DishCard";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UICard } from "@/shared/ui/UICard";
import { UIButton } from "@/shared/ui/UIButton";
import styles from "./CartPage.module.css";

export const CartPage = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { cart, isLoading, fetchCart, checkout } = useCartStore();
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	// Fetch cart on mount
	useEffect(() => {
		if (user) {
			fetchCart();
		}
	}, [user, fetchCart]);



	const handleCheckout = async () => {
		if (!user) return;
		setIsCheckingOut(true);
		try {
			await checkout();
			// Navigate to orders page after successful checkout
			navigate("/orders");
		} catch (error) {
			console.error("Failed to checkout:", error);
			alert("Checkout failed. Please try again.");
		} finally {
			setIsCheckingOut(false);
		}
	};

	if (isLoading) {
		return (
			<UIContainer className={styles["cart-page"]}>
				<p className={styles["cart-page__loading"]}>Loading cart...</p>
			</UIContainer>
		);
	}

	const isEmpty = !cart || !cart.cartItems || cart.cartItems.length === 0;

	return (
		<UIContainer className={styles["cart-page"]}>
			<div className={styles["cart-page__header"]}>
				<h1 className={styles["cart-page__title"]}>Shopping Cart</h1>
			</div>

			{isEmpty ? (
				<UICard padding="xl">
					<div className={styles["cart-page__empty"]}>
						<h2 className={styles["cart-page__empty-title"]}>Your cart is empty</h2>
						<p className={styles["cart-page__empty-text"]}>
							Start adding some delicious dishes to your cart!
						</p>
						<UIButton
							variant="solid"
							colorType="primary"
							onClick={() => navigate("/")}
						>
							Browse Restaurants
						</UIButton>
					</div>
				</UICard>
			) : (
				<div className={styles["cart-page__content"]}>
					<div className={styles["cart-page__items"]}>
						{cart.cartItems.map((item) => (
							<DishCard key={item.id} dish={item.dish} showSubtotal={true} />
						))}
					</div>

					<div className={styles["cart-page__sidebar"]}>
						<UICard padding="lg">
							<div className={styles["cart-summary"]}>
								<h2 className={styles["cart-summary__title"]}>Order Summary</h2>
								<div className={styles["cart-summary__row"]}>
									<span>Subtotal:</span>
									<span>${cart.total.toFixed(2)}</span>
								</div>
								<div className={styles["cart-summary__row"]}>
									<span>Tax:</span>
									<span>$0.00</span>
								</div>
								<div className={styles["cart-summary__row"]}>
									<span>Delivery:</span>
									<span>$0.00</span>
								</div>
								<div className={styles["cart-summary__divider"]} />
								<div className={styles["cart-summary__total"]}>
									<span>Total:</span>
									<span>${cart.total.toFixed(2)}</span>
								</div>
								<UIButton
									variant="solid"
									colorType="primary"
									fullWidth
									onClick={handleCheckout}
									disabled={isCheckingOut || isLoading}
								>
									{isCheckingOut ? "Processing..." : "Checkout"}
								</UIButton>
							</div>
						</UICard>
					</div>
				</div>
			)}
		</UIContainer>
	);
};
