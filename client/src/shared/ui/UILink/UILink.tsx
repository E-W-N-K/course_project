import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router'
import styles from './UILink.module.css'

interface UILinkProps extends LinkProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary'
}

export const UILink: FC<UILinkProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const classes = [
    styles.link,
    styles[`link--${variant}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  )
}
