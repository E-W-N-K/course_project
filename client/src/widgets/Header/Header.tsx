import { useUserStore } from "@/entities/User";
import { LogoutButton } from "@/features/Auth/LogoutButton";
import { UIBadge } from "@/shared/ui/UIBadge/UIBadge";
import { UIFlex } from "@/shared/ui/UIFlex/UIFlex";
import { UILink } from "@/shared/ui/UILink/UILink";
import { UIContainer } from "@/shared/ui/UIContainer/UIContainer";
import styles from "./Header.module.css";

export const Header = () => {
	const { isAuthenticated, user } = useUserStore();

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
									<UILink to="/restaurants" variant="secondary">
										Restaurants
									</UILink>

									{user?.role === "admin" && (
										<>
											<UILink to="/admin" variant="secondary">
												Admin Panel
											</UILink>
											<UILink to="/ui" variant="secondary">
												UI Demo
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
									{user.role === "admin" && (
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
