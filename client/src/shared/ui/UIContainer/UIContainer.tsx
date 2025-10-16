import type { FC, ReactNode } from 'react'
import styles from './UIContainer.module.css'

interface UIContainerProps {
  children: ReactNode
  className?: string
}

export const UIContainer: FC<UIContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {children}
    </div>
  )
}
