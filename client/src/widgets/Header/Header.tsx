import { useUserStore } from '@/entities/User';
import { LogoutButton } from '@/features/Auth/LogoutButton';
import { UIFlex } from '@/shared/ui/UIFlex/UIFlex';
import { UILink } from '@/shared/ui/UILink/UILink';
import { UIContainer } from '@/shared/ui/UIContainer/UIContainer';
import styles from './Header.module.css';

export const Header = () => {
  const { isAuthenticated, user } = useUserStore();

  return (
    <header className={styles.header}>
      <UIContainer>
        <UIFlex justify="between" align="center">
          <nav>
            <UIFlex gap="lg" align="center">
              <UILink to="/" variant="primary" className={styles.logo}>
                Food Delivery
              </UILink>

              {isAuthenticated && (
                <>
                  <UILink to="/restaurants" variant="secondary">
                    Restaurants
                  </UILink>

                  {user?.role === 'admin' && (
                    <UILink to="/admin" variant="secondary">
                      Admin Panel
                    </UILink>
                  )}

                  <UILink to="/ui" variant="secondary">
                    UI Demo
                  </UILink>
                </>
              )}
            </UIFlex>
          </nav>

          <UIFlex gap="md" align="center">
            {isAuthenticated && user ? (
              <>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span
                    className={`${styles.badge} ${
                      user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser
                    }`}
                  >
                    {user.role}
                  </span>
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
