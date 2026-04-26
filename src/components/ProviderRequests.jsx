import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function ProviderRequests({ onRefresh }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchProviderRequests()
  }, [])

  const fetchProviderRequests = async () => {
    try {
      const response = await api.get('/admin/provider-requests')
      setRequests(response.data)
    } catch (error) {
      showError('Failed to load provider requests')
      console.error('Error fetching provider requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (requestId, action) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }))
    
    try {
      await api.post(`/admin/provider-requests/${requestId}/${action}`, {})

      showSuccess(`Provider application ${action}d successfully`)
      
      // Remove the processed request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId))
      
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(`Failed to ${action} provider application`)
      console.error(`Error ${action}ing provider request:`, error)
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }))
    }
  }

  const getProviderTypeIcon = (type) => {
    const icons = {
      'nurse': '👩‍⚕️',
      'doctor': '👨‍⚕️',
      'caregiver': '🤝',
      'midwife': '👶',
      'physiotherapist': '🏃‍♂️',
      'nutritionist': '🥗',
      'mental-health': '🧠'
    }
    return icons[type] || '👨‍⚕️'
  }

  const getProviderTypeName = (type) => {
    const names = {
      'nurse': 'Registered Nurse',
      'doctor': 'General Practitioner',
      'caregiver': 'Professional Caregiver',
      'midwife': 'Certified Midwife',
      'physiotherapist': 'Physiotherapist',
      'nutritionist': 'Nutritionist',
      'mental-health': 'Mental Health Professional'
    }
    return names[type] || type
  }

  if (loading) {
    return <LoadingSpinner text="Loading provider applications..." />
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>👩‍⚕️ Provider Applications</h3>
        <button className="btn btn-outline" onClick={fetchProviderRequests}>
          🔄 Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '48px'}}>
          <div style={{fontSize: '3rem', marginBottom: '16px'}}>✅</div>
          <h4 style={{color: '#1f2937', marginBottom: '8px'}}>No Pending Applications</h4>
          <p style={{color: '#6b7280'}}>All provider applications have been processed</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {requests.map(request => (
            <div key={request.id} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <span style={{fontSize: '2rem'}}>{getProviderTypeIcon(request.provider_type)}</span>
                    <div>
                      <h4 style={{color: '#1f2937', margin: 0}}>{request.name}</h4>
                      <p style={{color: '#6b7280', margin: 0, fontSize: '0.875rem'}}>{request.email}</p>
                      <p style={{color: '#7c2d12', margin: '2px 0 0 0', fontSize: '0.875rem', fontWeight: '600'}}>
                        {getProviderTypeName(request.provider_type)}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px'}}>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                        Phone:
                      </span>
                      <p style={{color: '#374151', margin: '2px 0 0 0', fontSize: '0.875rem'}}>
                        {request.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                        Location:
                      </span>
                      <p style={{color: '#374151', margin: '2px 0 0 0', fontSize: '0.875rem'}}>
                        {request.location || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                        Availability:
                      </span>
                      <p style={{color: '#374151', margin: '2px 0 0 0', fontSize: '0.875rem'}}>
                        {request.availability || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280'}}>
                    <span>📅 Applied: {new Date(request.created_at).toLocaleDateString()}</span>
                    <span>👤 Registered: {new Date(request.user_created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{display: 'flex', gap: '8px', marginLeft: '16px'}}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleRequest(request.id, 'approve')}
                    disabled={processing[request.id]}
                    style={{minWidth: '100px'}}
                  >
                    {processing[request.id] ? '⏳' : '✅ Approve'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRequest(request.id, 'reject')}
                    disabled={processing[request.id]}
                    style={{minWidth: '100px'}}
                  >
                    {processing[request.id] ? '⏳' : '❌ Reject'}
                  </button>
                </div>
              </div>

              {/* Application Details */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{marginBottom: '8px'}}>
                  <span style={{fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                    Application Details:
                  </span>
                  <p style={{color: '#374151', margin: '4px 0 0 0', fontSize: '0.875rem'}}>
                    {request.request_reason || 'Provider registration application'}
                  </p>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.875rem'}}>
                  <div>
                    <span style={{color: '#6b7280'}}>Status:</span>
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      PENDING APPROVAL
                    </span>
                  </div>
                  <div>
                    <span style={{color: '#6b7280'}}>Application ID:</span>
                    <span style={{marginLeft: '8px', fontFamily: 'monospace', color: '#374151'}}>#{request.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="card" style={{marginTop: '24px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
          <span style={{fontSize: '1.5rem'}}>ℹ️</span>
          <div>
            <h4 style={{color: '#15803d', margin: '0 0 8px 0'}}>Provider Approval Process</h4>
            <ul style={{color: '#15803d', margin: 0, paddingLeft: '20px'}}>
              <li>Review provider credentials and qualifications carefully</li>
              <li>Approved providers will be able to receive service assignments</li>
              <li>Only approved providers appear in the assignment list</li>
              <li>Rejected applications can be reconsidered upon reapplication</li>
              <li>All approval actions are logged for quality assurance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderRequests