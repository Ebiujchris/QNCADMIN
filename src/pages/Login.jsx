import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../config/api'

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      const { user, token } = response.data

      if (user.role !== 'admin') {
        showError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }

      localStorage.setItem('adminUser', JSON.stringify(user))
      localStorage.setItem('adminToken', token)
      setUser(user)

      showSuccess(`Welcome to Admin Panel, ${user.name}!`)
      navigate('/dashboard')
    } catch (error) {
      const errorData = error.response?.data
      
      if (errorData?.needsApproval) {
        showError('Your admin account is pending approval. Please wait for an existing admin to approve your request.')
      } else {
        const message = errorData?.message || 'Login failed. Please check your credentials.'
        showError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container">
          <h1>🛡️ QNC Solutions Admin Panel</h1>
          <p>Secure access for system administrators</p>
        </div>
      </div>

      <div className="container" style={{maxWidth: '450px', marginTop: '40px'}}>
        <div className="card card-elevated">
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: '#1f2937'}}>
              Admin Login
            </h2>
            <p style={{color: '#6b7280'}}>Enter your administrator credentials</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter admin email address"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large" 
              style={{width: '100%', marginTop: '8px'}}
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" text="Authenticating..." /> : '🔐 Admin Sign In'}
            </button>
          </form>

          <div style={{textAlign: 'center', marginTop: '24px', padding: '20px 0', borderTop: '1px solid #e5e7eb'}}>
            <p style={{color: '#6b7280', marginBottom: '16px'}}>
              Need admin access?
            </p>
            <Link to="/register" className="btn btn-outline" style={{textDecoration: 'none'}}>
              Request Admin Account
            </Link>
          </div>

          <div style={{textAlign: 'center', marginTop: '20px', padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px', border: '1px solid #3b82f6'}}>
            <p style={{fontSize: '0.875rem', color: '#1e40af', marginBottom: '8px'}}>
              <strong>ℹ️ Admin Access Process:</strong>
            </p>
            <p style={{fontSize: '0.875rem', color: '#1e40af'}}>
              New admin accounts require approval from existing administrators. 
              After registration, please wait for approval before attempting to login.
            </p>
          </div>

          <div style={{textAlign: 'center', marginTop: '20px', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5'}}>
            <p style={{fontSize: '0.875rem', color: '#991b1b'}}>
              <strong>⚠️ Security Notice:</strong><br />
              This panel provides full system access. Only authorized administrators should use this interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login