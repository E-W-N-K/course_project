import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { UIPage } from '../pages/UIPage'
import { UILink, UIFlex } from '../shared/ui'
import './App.css'
import styles from './App.module.css'

function App() {
  return (
    <BrowserRouter>
      <nav className={styles.nav}>
        <UIFlex gap="lg">
          <UILink to="/" variant="primary">Home</UILink>
          <UILink to="/ui" variant="primary">UI Components</UILink>
        </UIFlex>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ui" element={<UIPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
