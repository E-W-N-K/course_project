import type { ButtonHTMLAttributes, FC } from 'react'
import styles from './UIButton.module.css'

interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline'
  colorType?: 'primary' | 'secondary' | 'danger'
}

export const UIButton: FC<UIButtonProps> = ({
  variant = 'solid',
  colorType = 'primary',
  className = '',
  children,
  ...props
}) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[colorType],
    className
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}