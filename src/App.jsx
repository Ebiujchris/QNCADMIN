import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing admin session
    const savedUser = localStorage.getItem('adminUser')
    const token = localStorage.getItem('adminToken')
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser)
        if (userData.role === 'admin') {
          setUser(userData)
        } else {
          // Clear non-admin data
          localStorage.removeItem('adminUser')
          localStorage.removeItem('adminToken')
        }
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('adminUser')
        localStorage.removeItem('adminToken')
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminToken')
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <LoadingSpinner size="large" text="Loading QNC Admin Panel..." />
      </div>
    )
  }

  return (
    <ToastProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Navbar user={user} logout={logout} />
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App