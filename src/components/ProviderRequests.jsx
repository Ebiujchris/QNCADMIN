import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function ProviderRequests({ onRefresh }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [selected, setSelected] = useState(null)
  const { showSuccess, showError } = useToast()

  useEffect(() => { fetchProviderRequests() }, [])

  const fetchProviderRequests = async () => {
    try {
      const response = await api.get('/admin/provider-requests')
      setRequests(response.data)
    } catch (error) {
      showError('Failed to load provider requests')
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (requestId, action) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }))
    try {
      await api.post(`/admin/provider-requests/${requestId}/${action}`, {})
      showSuccess(`Provider application ${action}d successfully`)
      setRequests(prev => prev.filter(r => r.id !== requestId))
      setSelected(null)
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(`Failed to ${action} provider application`)
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }))
    }
  }

  const typeIcon = { nurse: '👩‍⚕️', doctor: '👨‍⚕️', caregiver: '🤝' }
  const typeName = { nurse: 'Registered Nurse', doctor: 'General Practitioner', caregiver: 'Professional Caregiver' }

  const Field = ({ label, value }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ color: '#1f2937', fontSize: '0.9rem', lineHeight: '1.5' }}>
        {value || <span style={{ color: '#d1d5db', fontStyle: 'italic' }}>Not provided</span>}
      </div>
    </div>
  )

  if (loading) return <LoadingSpinner text="Loading provider applications..." />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1f2937' }}>👩‍⚕️ Provider Applications ({requests.length})</h3>
        <button className="btn btn-outline btn-small" onClick={fetchProviderRequests}>🔄 Refresh</button>
      </div>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
          <h4 style={{ color: '#1f2937', marginBottom: '8px' }}>No Pending Applications</h4>
          <p style={{ color: '#6b7280' }}>All provider applications have been processed</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {requests.map(req => (
            <div key={req.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1e40af, #7c2d12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
                  }}>
                    {typeIcon[req.provider_type] || '👨‍⚕️'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '1rem' }}>{req.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{req.email}</div>
                    <div style={{ color: '#7c2d12', fontSize: '0.85rem', fontWeight: '600', marginTop: '2px' }}>
                      {typeName[req.provider_type] || req.provider_type}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Applied {new Date(req.created_at).toLocaleDateString()}
                  </span>
                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => setSelected(req)}
                  >
                    🔍 View Details
                  </button>
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => handleRequest(req.id, 'approve')}
                    disabled={processing[req.id]}
                  >
                    {processing[req.id] ? '⏳' : '✅ Approve'}
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleRequest(req.id, 'reject')}
                    disabled={processing[req.id]}
                  >
                    {processing[req.id] ? '⏳' : '❌ Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '100%', maxWidth: '680px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #7c2d12)',
              padding: '24px 28px', borderRadius: '16px 16px 0 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
                }}>
                  {typeIcon[selected.provider_type] || '👨‍⚕️'}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '1.15rem' }}>{selected.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    {typeName[selected.provider_type] || selected.provider_type}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              {/* Contact Info */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  Contact Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <Field label="Email" value={selected.email} />
                  <Field label="Phone" value={selected.phone} />
                  <Field label="Location" value={selected.location} />
                  <Field label="Applied" value={new Date(selected.created_at).toLocaleDateString()} />
                </div>
              </div>

              {/* Professional Details */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  Professional Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <Field label="Specialization" value={typeName[selected.provider_type] || selected.provider_type} />
                  <Field label="Experience" value={selected.experience} />
                  <Field label="License Number" value={selected.license_number} />
                  <Field label="Availability" value={selected.availability} />
                </div>
              </div>

              {/* Qualifications */}
              {selected.qualifications && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                    Qualifications & Education
                  </h4>
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', color: '#374151', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {selected.qualifications}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selected.bio && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                    Professional Bio
                  </h4>
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', color: '#374151', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {selected.bio}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  Uploaded Documents
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: '📋 Professional License', url: selected.doc_license_url, required: true },
                    { label: '🎓 Certificate / Diploma', url: selected.doc_certificate_url, required: false },
                    { label: '📄 CV / Resume', url: selected.doc_cv_url, required: false }
                  ].map(doc => (
                    <div key={doc.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px', borderRadius: '8px',
                      background: doc.url ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${doc.url ? '#bbf7d0' : '#fecaca'}`
                    }}>
                      <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.9rem' }}>
                        {doc.label}
                        {doc.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                      </span>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success btn-small"
                          style={{ textDecoration: 'none', fontSize: '0.8rem' }}
                        >
                          👁️ View
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontStyle: 'italic' }}>Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Note */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  Application Note
                </h4>
                <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '14px', color: '#92400e', fontSize: '0.9rem', border: '1px solid #fde68a' }}>
                  {selected.request_reason || 'Provider registration application'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-success"
                  style={{ flex: 1 }}
                  onClick={() => handleRequest(selected.id, 'approve')}
                  disabled={processing[selected.id]}
                >
                  {processing[selected.id] ? '⏳ Processing...' : '✅ Approve Provider'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => handleRequest(selected.id, 'reject')}
                  disabled={processing[selected.id]}
                >
                  {processing[selected.id] ? '⏳ Processing...' : '❌ Reject Application'}
                </button>
                <button className="btn btn-outline" onClick={() => setSelected(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card" style={{ marginTop: '24px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
          <div>
            <h4 style={{ color: '#15803d', margin: '0 0 8px 0' }}>Provider Approval Process</h4>
            <ul style={{ color: '#15803d', margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
              <li>Click "View Details" to review full credentials before deciding</li>
              <li>Approved providers can receive service assignments immediately</li>
              <li>Rejected applicants are notified by email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderRequests
