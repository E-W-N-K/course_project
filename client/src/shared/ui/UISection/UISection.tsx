import type { FC, ReactNode } from 'react'
import styles from './UISection.module.css'

interface UISectionProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export const UISection: FC<UISectionProps> = ({ children, className = '', variant = 'primary' }) => {
  const variantClass = variant === 'secondary' ? styles['section--secondary'] : ''

  return (
    <section className={`${styles.section} ${variantClass} ${className}`}>
      {children}
    </section>
  )
}
