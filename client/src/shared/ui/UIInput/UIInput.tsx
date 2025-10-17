import type { InputHTMLAttributes, FC } from 'react'
import styles from './UIInput.module.css'

interface UIInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password'
  label?: string
  error?: string
}

export const UIInput: FC<UIInputProps> = ({
  type = 'text',
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`${styles.input} ${error ? styles['input--error'] : ''}`}
        {...props}
      />
      {error && (
        <span className={styles.error}>{error}</span>
      )}
    </div>
  )
}