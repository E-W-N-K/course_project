import type { FC, ReactNode } from 'react';
import styles from './UIBadge.module.css';

export interface UIBadgeProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  className?: string;
}

export const UIBadge: FC<UIBadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};
