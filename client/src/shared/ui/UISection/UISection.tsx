import type { FC, ReactNode } from 'react'
import styles from './UISection.module.css'

interface UISectionProps {
  children: ReactNode
  className?: string
  title?: string
}

export const UISection: FC<UISectionProps> = ({ children, className = '', title }) => {
  return (
    <section className={`${styles.section} ${className}`}>
      {title && <h2 className={styles.section__title}>{title}</h2>}
      {children}
    </section>
  )
}
