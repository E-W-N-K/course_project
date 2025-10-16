import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { UIPage } from '../pages/UIPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        padding: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--color-secondary-light)',
        display: 'flex',
        gap: 'var(--spacing-lg)'
      }}>
        <Link to="/">Home</Link>
        <Link to="/ui">UI Components</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ui" element={<UIPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
