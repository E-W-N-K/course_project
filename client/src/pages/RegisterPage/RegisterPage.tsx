import { UIContainer } from "@/shared/ui/UIContainer/UIContainer";
import { UISection } from "@/shared/ui/UISection/UISection";
import { UIFlex } from "@/shared/ui/UIFlex/UIFlex";
import { UILink } from "@/shared/ui/UILink/UILink";
import { RegisterForm } from "@/features/Auth/RegisterForm";
import styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
	return (
		<UISection>
			<UIContainer>
				<UIFlex direction="column" align="center" gap="lg">
					<div className={styles["register-page__header"]}>
						<h1 className={styles["register-page__title"]}>Create Account</h1>
						<p className={styles["register-page__subtitle"]}>
							Join our food delivery platform
						</p>
					</div>

					<RegisterForm />

					<div className={styles["register-page__footer"]}>
						<p className={styles["register-page__footer-text"]}>
							Already have an account?{" "}
							<UILink to="/login" variant="primary">
								Login here
							</UILink>
						</p>
					</div>
				</UIFlex>
			</UIContainer>
		</UISection>
	);
};
