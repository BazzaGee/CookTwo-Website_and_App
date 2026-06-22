import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './lib/auth'
import Portal from './pages/Portal'

function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream text-text-primary">
        <Routes>
          <Route path="*" element={<Portal />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
