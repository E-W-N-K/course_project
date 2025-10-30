import { UIContainer } from '@/shared/ui/UIContainer/UIContainer';
import { UISection } from '@/shared/ui/UISection/UISection';
import { UIFlex } from '@/shared/ui/UIFlex/UIFlex';
import { UILink } from '@/shared/ui/UILink/UILink';
import { LoginForm } from '@/features/Auth/LoginForm';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <UIContainer>
      <UISection>
        <UIFlex direction="column" align="center" gap="lg">
          <div className={styles['login-page__header']}>
            <h1 className={styles['login-page__title']}>Welcome Back</h1>
            <p className={styles['login-page__subtitle']}>Sign in to your account</p>
          </div>

          <LoginForm />

          <div className={styles['login-page__footer']}>
            <p className={styles['login-page__footer-text']}>
              Don't have an account?{' '}
              <UILink to="/register" variant="primary">
                Register here
              </UILink>
            </p>
          </div>
        </UIFlex>
      </UISection>
    </UIContainer>
  );
};
