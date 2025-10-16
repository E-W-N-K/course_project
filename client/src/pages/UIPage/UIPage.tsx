import { Button } from '../../shared/ui'
import styles from './UIPage.module.css'

export const UIPage = () => {
  return (
    <div className={styles.container}>
      <h1>UI Components</h1>

      <section className={styles.section}>
        <h2>Buttons</h2>
        <div className={styles.grid}>
          <Button variant="solid" colorType="primary">Primary Solid</Button>
          <Button variant="solid" colorType="secondary">Secondary Solid</Button>
          <Button variant="solid" colorType="danger">Danger Solid</Button>

          <Button variant="outline" colorType="primary">Primary Outline</Button>
          <Button variant="outline" colorType="secondary">Secondary Outline</Button>
          <Button variant="outline" colorType="danger">Danger Outline</Button>

          <Button variant="solid" colorType="primary" disabled>Disabled</Button>
        </div>
      </section>
    </div>
  )
}