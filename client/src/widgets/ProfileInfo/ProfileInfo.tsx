import { useUserStore } from "@/entities/User";
import { UICard } from "@/shared/ui";
import { UIBadge } from "@/shared/ui/UIBadge/UIBadge";
import styles from "./ProfileInfo.module.css";

export const ProfileInfo = () => {
	const user = useUserStore((state) => state.user);

	if (!user) {
		return null;
	}

	return (
		<UICard className={styles["profile-info"]} padding="xl">
			<div className={styles["profile-info__header"]}>
				<h2 className={styles["profile-info__title"]}>Profile Information</h2>
				<UIBadge variant={user.role === "admin" ? "primary" : "secondary"}>
					{user.role}
				</UIBadge>
			</div>

			<div className={styles["profile-info__content"]}>
				<div className={styles["profile-info__field"]}>
					<span className={styles["profile-info__label"]}>Name</span>
					<span className={styles["profile-info__value"]}>{user.name}</span>
				</div>

				<div className={styles["profile-info__field"]}>
					<span className={styles["profile-info__label"]}>Email</span>
					<span className={styles["profile-info__value"]}>{user.email}</span>
				</div>

				<div className={styles["profile-info__field"]}>
					<span className={styles["profile-info__label"]}>Phone</span>
					<span className={styles["profile-info__value"]}>
						{user.phone || "Not set"}
					</span>
				</div>

				<div className={styles["profile-info__field"]}>
					<span className={styles["profile-info__label"]}>Address</span>
					<span className={styles["profile-info__value"]}>
						{user.address || "Not set"}
					</span>
				</div>
			</div>
		</UICard>
	);
};
