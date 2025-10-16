import type { FC, ReactNode, CSSProperties } from 'react'
import styles from './UIGrid.module.css'

interface UIGridProps {
  children: ReactNode
  className?: string
  columns?: number
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export const UIGrid: FC<UIGridProps> = ({
  children,
  className = '',
  columns = 1,
  gap = 'lg'
}) => {
  const style: CSSProperties = {
    '--grid-columns': columns,
  } as CSSProperties

  return (
    <div
      className={`${styles.grid} ${styles[`grid--gap-${gap}`]} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
