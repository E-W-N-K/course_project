import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { getDeliveryInfo } from "@/entities/User/api/userApi";
import { useCartStore } from "@/entities/Cart";
import { DishCard } from "@/widgets/DishCard";
import { EditProfileForm } from "@/features/Profile/EditProfileForm";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UICard } from "@/shared/ui/UICard";
import { UIButton } from "@/shared/ui/UIButton";
import styles from "./CartPage.module.css";

export const CartPage = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { cart, isLoading, fetchCart, checkout } = useCartStore();
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [deliveryInfo, setDeliveryInfo] = useState<{ phone: string; address: string } | null>(null);

	// Fetch cart and delivery info on mount
	useEffect(() => {
		if (user) {
			fetchCart();
			loadDeliveryInfo();
		}
	}, [user, fetchCart]);

	const loadDeliveryInfo = async () => {
		try {
			const info = await getDeliveryInfo();
			setDeliveryInfo(info);
		} catch (error) {
			console.error("Failed to load delivery info:", error);
		}
	};



	const handleCheckout = async () => {
		if (!user) return;
		setIsCheckingOut(true);
		try {
			await checkout();
			// Navigate to profile page after successful checkout
			navigate("/profile");
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

	// Check if user has all required information for checkout
	const isProfileComplete = deliveryInfo?.phone && deliveryInfo?.address;
	const canCheckout = !isCheckingOut && !isLoading && isProfileComplete;

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
						<EditProfileForm onSave={loadDeliveryInfo} />
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
								{!isProfileComplete && (
									<p className={styles["cart-summary__warning"]}>
										Please fill in your phone and address above to checkout
									</p>
								)}
								<UIButton
									variant="solid"
									colorType="primary"
									fullWidth
									onClick={handleCheckout}
									disabled={!canCheckout}
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
