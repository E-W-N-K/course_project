import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { getDeliveryInfo } from "@/entities/User/api/userApi";
import { useCartStore } from "@/entities/Cart";
import { useNotificationStore } from "@/shared/model";
import { DishCard } from "@/widgets/DishCard";
import { EditProfileForm } from "@/features/Profile/EditProfileForm";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UICard } from "@/shared/ui/UICard";
import { UIButton } from "@/shared/ui/UIButton";
import { UISection, UIDialog, UIFlex } from "@/shared/ui";
import type { UIDialogRef } from "@/shared/ui/UIDialog";
import styles from "./CartPage.module.css";

export const CartPage = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { cart, isLoading, fetchCart, checkout, clearCart } = useCartStore();
	const showNotification = useNotificationStore(
		(state) => state.showNotification,
	);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [deliveryInfo, setDeliveryInfo] = useState<{
		phone: string;
		address: string;
	} | null>(null);
	const clearCartDialogRef = useRef<UIDialogRef>(null);

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
			showNotification("success", "Order placed successfully!");
			// Navigate to profile page after successful checkout
			navigate("/profile");
		} catch (error) {
			console.error("Failed to checkout:", error);
			showNotification("error", "Checkout failed. Please try again.");
		} finally {
			setIsCheckingOut(false);
		}
	};

	const handleClearCart = () => {
		clearCartDialogRef.current?.open();
	};

	const confirmClearCart = async () => {
		try {
			await clearCart();
			clearCartDialogRef.current?.close();
		} catch (error) {
			console.error("Failed to clear cart:", error);
			showNotification("error", "Failed to clear cart. Please try again.");
		}
	};

	if (isLoading) {
		return (
			<UISection>
				<UIContainer className={styles["cart-page"]}>
					<p className={styles["cart-page__loading"]}>Loading cart...</p>
				</UIContainer>
			</UISection>
		);
	}

	const isEmpty = !cart || !cart.cartItems || cart.cartItems.length === 0;

	// Check if user has all required information for checkout
	const isProfileComplete = deliveryInfo?.phone && deliveryInfo?.address;
	const canCheckout = !isCheckingOut && !isLoading && isProfileComplete;

	return (
		<UISection>
			<UIContainer className={styles["cart-page"]}>
				<div className={styles["cart-page__header"]}>
					<h1 className={styles["cart-page__title"]}>Shopping Cart</h1>
					{!isEmpty && (
						<UIButton
							variant="outline"
							colorType="danger"
							onClick={handleClearCart}
							disabled={isLoading}
						>
							Clear Cart
						</UIButton>
					)}
				</div>

				{isEmpty ? (
					<UICard padding="xl">
						<div className={styles["cart-page__empty"]}>
							<h2 className={styles["cart-page__empty-title"]}>
								Your cart is empty
							</h2>
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
								<DishCard key={item.id} dish={item.dish} />
							))}
						</div>

						<div className={styles["cart-page__sidebar"]}>
							<UICard padding="lg">
								<div className={styles["cart-summary"]}>
									<h2 className={styles["cart-summary__title"]}>
										Order Summary
									</h2>
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

			<UIDialog
				ref={clearCartDialogRef}
				title="Clear Cart"
				size="sm"
				footer={
					<UIFlex gap={"md"}>
						<UIButton
							variant="outline"
							colorType="secondary"
							onClick={() => clearCartDialogRef.current?.close()}
						>
							Cancel
						</UIButton>
						<UIButton
							variant="solid"
							colorType="danger"
							onClick={confirmClearCart}
						>
							Clear All Items
						</UIButton>
					</UIFlex>
				}
			>
				<p className={"text"}>Are you sure you want to clear all items from your cart? This action cannot be undone.</p>
			</UIDialog>
		</UISection>
	);
};
