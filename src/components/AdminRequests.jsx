import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function AdminRequests({ onRefresh }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchAdminRequests()
  }, [])

  const fetchAdminRequests = async () => {
    try {
      const response = await api.get('/admin/admin-requests')
      setRequests(response.data)
    } catch (error) {
      showError('Failed to load admin requests')
      console.error('Error fetching admin requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (requestId, action) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }))
    
    try {
      await api.post(`/admin/admin-requests/${requestId}/${action}`, {})

      showSuccess(`Admin request ${action}d successfully`)
      
      // Remove the processed request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId))
      
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(`Failed to ${action} admin request`)
      console.error(`Error ${action}ing admin request:`, error)
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }))
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading admin requests..." />
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>🔐 Admin Access Requests</h3>
        <button className="btn btn-outline" onClick={fetchAdminRequests}>
          🔄 Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '48px'}}>
          <div style={{fontSize: '3rem', marginBottom: '16px'}}>✅</div>
          <h4 style={{color: '#1f2937', marginBottom: '8px'}}>No Pending Requests</h4>
          <p style={{color: '#6b7280'}}>All admin access requests have been processed</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {requests.map(request => (
            <div key={request.id} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <span style={{fontSize: '1.5rem'}}>👤</span>
                    <div>
                      <h4 style={{color: '#1f2937', margin: 0}}>{request.name}</h4>
                      <p style={{color: '#6b7280', margin: 0, fontSize: '0.875rem'}}>{request.email}</p>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '12px'}}>
                    <span style={{fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      Request Reason:
                    </span>
                    <p style={{color: '#374151', margin: '4px 0 0 0'}}>
                      {request.request_reason || 'No reason provided'}
                    </p>
                  </div>

                  <div style={{display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280'}}>
                    <span>📅 Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                    <span>👤 User Since: {new Date(request.user_created_at).toLocaleDateString()}</span>
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

              {/* Request Details */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.875rem'}}>
                  <div>
                    <span style={{color: '#6b7280'}}>Status:</span>
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: '#fbbf24',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      PENDING
                    </span>
                  </div>
                  <div>
                    <span style={{color: '#6b7280'}}>Request ID:</span>
                    <span style={{marginLeft: '8px', fontFamily: 'monospace', color: '#374151'}}>#{request.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="card" style={{marginTop: '24px', backgroundColor: '#eff6ff', border: '1px solid #dbeafe'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
          <span style={{fontSize: '1.5rem'}}>ℹ️</span>
          <div>
            <h4 style={{color: '#1e40af', margin: '0 0 8px 0'}}>Admin Approval Process</h4>
            <ul style={{color: '#1e40af', margin: 0, paddingLeft: '20px'}}>
              <li>Review each request carefully before approving</li>
              <li>Approved users will receive admin access immediately</li>
              <li>Rejected users will be notified and can reapply</li>
              <li>All actions are logged for security purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRequests