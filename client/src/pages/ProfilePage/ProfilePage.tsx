import { EditProfileForm } from "@/features/Profile/EditProfileForm";
import { OrderHistory } from "@/widgets/OrderHistory";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UIFlex } from "@/shared/ui/UIFlex";
import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
	return (
		<UIContainer className={styles["profile-page"]}>
			<h1 className={styles["profile-page__title"]}>My Profile</h1>

			<UIFlex direction="column" gap="xl" align={"stretch"}>
				<EditProfileForm />
				<OrderHistory />
			</UIFlex>
		</UIContainer>
	);
};
