import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { useCartStore } from "@/entities/Cart";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UICard } from "@/shared/ui/UICard";
import { UIButton } from "@/shared/ui/UIButton";
import styles from "./CartPage.module.css";

interface CartItemWithDish {
	id: number;
	dishId: number;
	quantity: number;
	price: number;
	itemTotal: number;
}

export const CartPage = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { cart, isLoading, fetchCart, removeItem, checkout } = useCartStore();
	const [cartItemsWithDishes, setCartItemsWithDishes] = useState<CartItemWithDish[]>([]);
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	// Fetch cart on mount
	useEffect(() => {
		if (user) {
			fetchCart();
		}
	}, [user, fetchCart]);

	// Map cart items with empty dish placeholders (backend doesn't return dish details)
	useEffect(() => {
		if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
			setCartItemsWithDishes([]);
			return;
		}

		// Backend only returns dishId, not full dish details
		setCartItemsWithDishes(cart.cartItems);
	}, [cart]);

	const handleIncreaseQuantity = async (dishId: number) => {
		if (!user) return;
		try {
			// Add one more of this dish
			const { addToCart } = useCartStore.getState();
			await addToCart(dishId, 1);
		} catch (error) {
			console.error("Failed to increase quantity:", error);
		}
	};

	const handleDecreaseQuantity = async (cartItemId: number) => {
		if (!user) return;
		try {
			await removeItem(cartItemId, 1);
		} catch (error) {
			console.error("Failed to decrease quantity:", error);
		}
	};

	const handleRemoveItem = async (cartItemId: number, quantity: number) => {
		if (!user) return;
		try {
			await removeItem(cartItemId, quantity);
		} catch (error) {
			console.error("Failed to remove item:", error);
		}
	};


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
						{cartItemsWithDishes.map((item) => (
							<UICard key={item.id} padding="md">
								<div className={styles["cart-item"]}>
									<div className={styles["cart-item__wrapper"]}>
										<div className={styles["cart-item__content"]}>
											<div className={styles["cart-item__header"]}>
												<h3 className={styles["cart-item__name"]}>
													Dish #{item.dishId}
												</h3>
												<span className={styles["cart-item__price"]}>
													${item.price.toFixed(2)}
												</span>
											</div>
											<div className={styles["cart-item__footer"]}>
												<div className={styles["cart-item__quantity-controls"]}>
													<button
														className={styles["cart-item__quantity-btn"]}
														onClick={() => handleDecreaseQuantity(item.id)}
														disabled={isLoading}
													>
														-
													</button>
													<span className={styles["cart-item__quantity"]}>
														{item.quantity}
													</span>
													<button
														className={styles["cart-item__quantity-btn"]}
														onClick={() => handleIncreaseQuantity(item.dishId)}
														disabled={isLoading}
													>
														+
													</button>
												</div>
												<div className={styles["cart-item__actions"]}>
													<span className={styles["cart-item__subtotal"]}>
														${item.itemTotal.toFixed(2)}
													</span>
													<UIButton
														variant="outline"
														colorType="danger"
														onClick={() => handleRemoveItem(item.id, item.quantity)}
														disabled={isLoading}
													>
														Remove
													</UIButton>
												</div>
											</div>
										</div>
									</div>
								</div>
							</UICard>
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
