import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import api from '../config/api'

function AllBookings({ bookings, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [payingId, setPayingId] = useState(null)
  const { showSuccess, showError } = useToast()

  const markAsPaid = async (bookingId, price) => {
    setPayingId(bookingId)
    try {
      await api.post(`/payments/${bookingId}/mark-paid`)
      showSuccess(`Payment of UGX ${parseFloat(price).toLocaleString()} confirmed!`)
      onRefresh()
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to mark as paid.')
    } finally {
      setPayingId(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-badge status-pending',
      'assigned': 'status-badge status-assigned',
      'paid': 'status-badge status-paid',
      'completed': 'status-badge status-completed'
    }
    return statusClasses[status] || 'status-badge'
  }

  const getServiceIcon = (serviceType) => {
    const icons = {
      'nursing': '🏥',
      'doctor': '👨‍⚕️',
      'caregiver': '🤝'
    }
    return icons[serviceType] || '🏥'
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      booking.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.provider_name && booking.provider_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesStatus && matchesSearch
  })

  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>📋 All Bookings ({filteredBookings.length})</h3>
        <button className="btn btn-primary btn-small" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{marginBottom: '24px'}}>
        <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center'}}>
          <div style={{flex: '1', minWidth: '200px'}}>
            <input
              type="text"
              placeholder="Search by patient, service, or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px'}}
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px'}}
            >
              <option value="all">All Status ({bookings.length})</option>
              <option value="pending">Pending ({statusCounts.pending || 0})</option>
              <option value="assigned">Assigned ({statusCounts.assigned || 0})</option>
              <option value="paid">Paid ({statusCounts.paid || 0})</option>
              <option value="completed">Completed ({statusCounts.completed || 0})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px'}}>
          <span style={{fontSize: '4rem', display: 'block', marginBottom: '16px'}}>📋</span>
          <h4 style={{color: '#1f2937', marginBottom: '8px'}}>No bookings found</h4>
          <p style={{color: '#6b7280'}}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No bookings in the system yet.'}
          </p>
        </div>
      ) : (
        <div style={{maxHeight: '600px', overflowY: 'auto'}}>
          {filteredBookings.map(booking => (
            <div key={booking.id} className="card" style={{marginBottom: '16px', padding: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px'}}>
                <div style={{flex: '1', minWidth: '300px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <span style={{fontSize: '1.25rem'}}>
                      {getServiceIcon(booking.service_type)}
                    </span>
                    <div>
                      <h4 style={{color: '#1f2937', fontSize: '1.125rem', fontWeight: '600', margin: 0}}>
                        {booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)} Service
                      </h4>
                      <p style={{color: '#6b7280', fontSize: '0.875rem', margin: '2px 0'}}>
                        Booking #{booking.id}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px'}}>
                    <div>
                      <strong style={{color: '#374151', fontSize: '0.875rem'}}>Patient:</strong>
                      <p style={{color: '#6b7280', margin: '2px 0', fontSize: '0.875rem'}}>{booking.patient_name}</p>
                    </div>
                    <div>
                      <strong style={{color: '#374151', fontSize: '0.875rem'}}>Date:</strong>
                      <p style={{color: '#6b7280', margin: '2px 0', fontSize: '0.875rem'}}>
                        {new Date(booking.preferred_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <strong style={{color: '#374151', fontSize: '0.875rem'}}>Created:</strong>
                      <p style={{color: '#6b7280', margin: '2px 0', fontSize: '0.875rem'}}>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {booking.provider_name && (
                    <div style={{marginTop: '8px', padding: '8px 12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #e0f2fe'}}>
                      <p style={{color: '#0369a1', fontSize: '0.875rem', margin: '2px 0'}}>
                        <strong>Provider:</strong> {booking.provider_name} ({booking.provider_type})
                      </p>
                      {booking.price && (
                        <div>
                          {booking.rate_per_day && booking.days && (
                            <p style={{color: '#6b7280', fontSize: '0.8rem', margin: '2px 0'}}>
                              UGX {parseFloat(booking.rate_per_day).toLocaleString()}/day × {booking.days} day(s)
                            </p>
                          )}
                          <p style={{color: '#065f46', fontSize: '0.875rem', margin: '2px 0', fontWeight: '600'}}>
                            <strong>Total:</strong> UGX {parseFloat(booking.price).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div style={{textAlign: 'right', minWidth: '140px'}}>
                  <span className={getStatusBadge(booking.status)}>
                    {booking.status}
                  </span>
                  {booking.urgency !== 'normal' && (
                    <p style={{margin: '4px 0'}}>
                      <span style={{
                        color: booking.urgency === 'emergency' ? '#ef4444' : '#f59e0b',
                        fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase'
                      }}>
                        {booking.urgency}
                      </span>
                    </p>
                  )}
                  {booking.status === 'assigned' && booking.price && (
                    <button
                      onClick={() => markAsPaid(booking.id, booking.price)}
                      disabled={payingId === booking.id}
                      className="btn btn-success btn-small"
                      style={{marginTop: '10px', width: '100%', fontSize: '0.8rem'}}
                    >
                      {payingId === booking.id ? '⏳...' : '💳 Mark Paid'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllBookings