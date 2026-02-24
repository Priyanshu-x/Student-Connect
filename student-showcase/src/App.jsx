import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import AuthPage from './components/AuthPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import { useAuth } from './context/AuthContext'

function App() {
  const location = useLocation()

  return (
    <div className={`app ${location.pathname.startsWith('/login') || location.pathname.startsWith('/signup') ? 'auth-mode' : ''}`}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<AuthPage variant="login" />} />
          <Route path="/signup" element={<AuthPage variant="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
