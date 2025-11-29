import { useUserStore } from "@/entities/User";
import { NavLinks } from "@/widgets/NavLinks";
import styles from "./BottomNav.module.css";

export const BottomNav = () => {
	const { isAuthenticated } = useUserStore();

	if (!isAuthenticated) {
		return null;
	}

	return (
		<nav className={styles["bottom-nav"]}>
			<NavLinks variant="bottom" />
		</nav>
	);
};
