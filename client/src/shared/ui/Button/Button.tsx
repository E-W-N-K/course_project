import { ButtonHTMLAttributes, FC } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline'
  colorType?: 'primary' | 'secondary' | 'danger'
}

export const Button: FC<ButtonProps> = ({
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