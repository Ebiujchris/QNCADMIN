import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../config/api'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    requestReason: '',
    role: 'admin'
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

    // Validation
    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (formData.requestReason.length < 10) {
      showError('Please provide a detailed reason for admin access (minimum 10 characters)')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin',
        requestReason: formData.requestReason
      })
      
      if (response.data.user?.needsApproval) {
        showSuccess('Admin request submitted for approval. You will be notified once an existing admin reviews your request.')
      } else {
        showSuccess('Admin account created successfully! You can now login.')
      }
      
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container">
          <h1>🛡️ Admin Access Request</h1>
          <p>Request administrator access to QNC Solutions</p>
        </div>
      </div>

      <div className="container" style={{maxWidth: '500px', marginTop: '40px'}}>
        <div className="card card-elevated">
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: '#1f2937'}}>
              Admin Access Request
            </h2>
            <p style={{color: '#6b7280'}}>Request QNC Solutions Administrator Access</p>
          </div>
          
          <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe'}}>
            <p style={{fontSize: '0.875rem', color: '#1e40af', marginBottom: '8px'}}>
              <strong>ℹ️ Admin Access Process:</strong>
            </p>
            <ul style={{fontSize: '0.875rem', color: '#1e40af', paddingLeft: '20px', margin: 0}}>
              <li>First admin account is automatically approved</li>
              <li>Subsequent requests require approval from existing admins</li>
              <li>You'll be notified once your request is reviewed</li>
              <li>All admin activities are logged and monitored</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password (min 6 characters)"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Reason for Admin Access *</label>
              <textarea
                name="requestReason"
                value={formData.requestReason}
                onChange={handleChange}
                placeholder="Please explain why you need admin access to QNC Solutions. Include your role, responsibilities, and how you plan to use admin privileges..."
                rows="4"
                required
                disabled={loading}
              />
              <small style={{color: '#6b7280', fontSize: '0.875rem'}}>
                {formData.requestReason.length}/500 characters (minimum 10 required)
              </small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large" 
              style={{width: '100%', marginTop: '8px'}}
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" text="Submitting Request..." /> : '🛡️ Request Admin Access'}
            </button>
          </form>

          <div style={{textAlign: 'center', marginTop: '24px', padding: '20px 0', borderTop: '1px solid #e5e7eb'}}>
            <p style={{color: '#6b7280', marginBottom: '16px'}}>
              Already have an admin account?
            </p>
            <Link to="/login" className="btn btn-outline" style={{textDecoration: 'none'}}>
              Admin Sign In
            </Link>
          </div>

          <div style={{textAlign: 'center', marginTop: '20px', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5'}}>
            <p style={{fontSize: '0.875rem', color: '#991b1b'}}>
              <strong>⚠️ Important:</strong><br />
              Admin access provides full system control. Only request access if you have legitimate administrative responsibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register