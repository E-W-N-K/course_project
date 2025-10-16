import { Button } from '../shared/ui'
import './App.css'

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Food Delivery Platform</h1>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <Button variant="solid" colorType="primary">Primary Solid</Button>
        <Button variant="solid" colorType="secondary">Secondary Solid</Button>
        <Button variant="solid" colorType="danger">Danger Solid</Button>

        <Button variant="outline" colorType="primary">Primary Outline</Button>
        <Button variant="outline" colorType="secondary">Secondary Outline</Button>
        <Button variant="outline" colorType="danger">Danger Outline</Button>

        <Button variant="solid" colorType="primary" disabled>Disabled</Button>
      </div>
    </div>
  )
}

export default App
