import { useUserStore } from "@/entities/User";
import { useCartStore } from "@/entities/Cart";
import { UIBadge } from "@/shared/ui/UIBadge/UIBadge";
import { UILink } from "@/shared/ui/UILink/UILink";
import { UIFlex } from "@/shared/ui/UIFlex/UIFlex";
import styles from "./NavLinks.module.css";

interface NavLinksProps {
	variant?: "header" | "bottom";
}

export const NavLinks = ({ variant = "header" }: NavLinksProps) => {
	const { user } = useUserStore();
	const { getItemCount } = useCartStore();
	const cartItemCount = getItemCount();
	const isAdmin = user?.role === "ADMIN";

	const containerClassName = variant === "bottom"
		? styles["nav-links--bottom"]
		: "";

	return (
		<UIFlex gap="lg" align="center" className={containerClassName}>
			<UILink to="/" variant="secondary">
				Homepage
			</UILink>

			{!isAdmin && (
				<>
					<UILink to="/profile" variant="secondary">
						Profile
					</UILink>

					<div className={styles["nav-links__cart"]}>
						<UILink to="/cart" variant="secondary">
							Cart
						</UILink>
						{cartItemCount > 0 && (
							<UIBadge variant="primary">{cartItemCount}</UIBadge>
						)}
					</div>
				</>
			)}

			{isAdmin && (
				<>
					<UILink to="/admin/orders" variant="secondary">
						Orders
					</UILink>
					<UILink to="/admin/users" variant="secondary">
						Users
					</UILink>
					<UILink to="/ui" variant="secondary">
						UI
					</UILink>
				</>
			)}
		</UIFlex>
	);
};
