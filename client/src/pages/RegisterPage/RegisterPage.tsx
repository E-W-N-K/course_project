import { UIContainer } from '@/shared/ui/UIContainer/UIContainer';
import { UISection } from '@/shared/ui/UISection/UISection';
import { UIFlex } from '@/shared/ui/UIFlex/UIFlex';
import { UILink } from '@/shared/ui/UILink/UILink';
import { RegisterForm } from '@/features/Auth/RegisterForm';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  return (
    <UIContainer>
      <UISection>
        <UIFlex direction="column" align="center" gap="lg">
          <div className={styles.header}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join our food delivery platform</p>
          </div>

          <RegisterForm />

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <UILink to="/login" variant="primary">
                Login here
              </UILink>
            </p>
          </div>
        </UIFlex>
      </UISection>
    </UIContainer>
  );
};
