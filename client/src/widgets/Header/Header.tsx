import { useEffect } from "react";
import { useUserStore } from "@/entities/User";
import { useCartStore } from "@/entities/Cart";
import { LogoutButton } from "@/features/Auth/LogoutButton";
import { UIBadge } from "@/shared/ui/UIBadge/UIBadge";
import { UIFlex } from "@/shared/ui/UIFlex/UIFlex";
import { UILink } from "@/shared/ui/UILink/UILink";
import { UIContainer } from "@/shared/ui/UIContainer/UIContainer";
import styles from "./Header.module.css";

export const Header = () => {
	const { isAuthenticated, user } = useUserStore();
	const { fetchCart, getItemCount } = useCartStore();
	const cartItemCount = getItemCount();

	// Fetch cart when user logs in
	useEffect(() => {
		if (user) {
			fetchCart();
		}
	}, [user, fetchCart]);

	return (
		<header className={styles.header}>
			<UIContainer>
				<UIFlex justify="between" align="center">
					<nav>
						<UIFlex gap="lg" align="center">
							<UILink
								to="/"
								variant="primary"
								className={styles["header__logo"]}
							>
								Food Delivery
							</UILink>

							{isAuthenticated && (
								<>
									<UILink to="/" variant="secondary">
										Homepage
									</UILink>

									<UILink to="/profile" variant="secondary">
										Profile
									</UILink>

									<div className={styles["header__cart"]}>
										<UILink to="/cart" variant="secondary">
											Cart
										</UILink>
										{cartItemCount > 0 && (
											<UIBadge variant="primary">{cartItemCount}</UIBadge>
										)}
									</div>

									{user?.role === "ADMIN" && (
										<>
											<UILink to="/admin/orders" variant="secondary">
												Manage Orders
											</UILink>
											<UILink to="/admin/users" variant="secondary">
												Manage Users
											</UILink>
										</>
									)}
								</>
							)}
						</UIFlex>
					</nav>

					<UIFlex gap="md" align="center">
						{isAuthenticated && user ? (
							<>
								<div className={styles["header__user-info"]}>
									<span className={styles["header__user-name"]}>
										{user.name}
									</span>
									{user.role === "ADMIN" && (
										<UIBadge variant="primary">{user.role}</UIBadge>
									)}
								</div>
								<LogoutButton />
							</>
						) : (
							<>
								<UILink to="/login" variant="primary">
									Login
								</UILink>
								<UILink to="/register" variant="primary">
									Register
								</UILink>
							</>
						)}
					</UIFlex>
				</UIFlex>
			</UIContainer>
		</header>
	);
};
