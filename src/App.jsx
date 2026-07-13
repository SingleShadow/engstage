import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from '@/components/Header'
import Home from '@/pages/Home'
import Practice from '@/pages/Practice'
import Dashboard from '@/pages/Dashboard'
import Review from '@/pages/Review'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Navigate to="/" />} />
            <Route path="/practice/:sceneId/:taskId/:mode" element={<Practice />} />
            <Route path="/practice/:sceneId/:mode" element={<Practice />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
