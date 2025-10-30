import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/User';
import { UIForm } from '@/shared/ui/UIForm/UIForm';
import { UIInput } from '@/shared/ui/UIInput/UIInput';
import { UIButton } from '@/shared/ui/UIButton/UIButton';
import styles from './RegisterForm.module.css';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useUserStore((state) => state.register);
  const isLoading = useUserStore((state) => state.isLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register({ name, email, password, role: 'user' });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <UIForm onSubmit={handleSubmit} className={styles['register-form']}>
      <div className={styles['register-form__group']}>
        <UIInput
          type="text"
          name="name"
          label="Full Name"
          value={name}
          onChange={(value) => setName(value)}
          required
          disabled={isLoading}
          placeholder="Enter your full name"
          minLength={2}
        />
      </div>

      <div className={styles['register-form__group']}>
        <UIInput
          type="email"
          name="email"
          label="Email"
          value={email}
          onChange={(value) => setEmail(value)}
          required
          disabled={isLoading}
          placeholder="Enter your email"
        />
      </div>

      <div className={styles['register-form__group']}>
        <UIInput
          type="password"
          name="password"
          label="Password"
          value={password}
          onChange={(value) => setPassword(value)}
          required
          disabled={isLoading}
          placeholder="Enter your password"
          minLength={6}
        />
      </div>

      {error && <div className={styles['register-form__error']}>{error}</div>}

      <UIButton
        type="submit"
        variant="solid"
        colorType="primary"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Creating account...' : 'Register'}
      </UIButton>
    </UIForm>
  );
};
