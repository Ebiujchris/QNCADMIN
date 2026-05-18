import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function PendingBookings({ bookings, providers, onRefresh }) {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [ratePerDay, setRatePerDay] = useState('')
  const [days, setDays] = useState('')
  const [providerPayment, setProviderPayment] = useState('')
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  const totalPrice = ratePerDay && days ? parseFloat(ratePerDay) * parseInt(days) : 0

  const assignProvider = async () => {
    if (!selectedBooking || !selectedProvider) return showError('Please select a provider')
    if (!ratePerDay || parseFloat(ratePerDay) <= 0) return showError('Please enter a valid rate per day')
    if (!days || parseInt(days) <= 0) return showError('Please enter a valid number of days')
    if (!providerPayment || parseFloat(providerPayment) <= 0) return showError('Please enter a valid provider payment amount')

    setAssignmentLoading(true)
    try {
      await api.post(`/admin/bookings/${selectedBooking.id}/assign`, {
        providerId: selectedProvider,
        ratePerDay: parseFloat(ratePerDay),
        days: parseInt(days),
        providerPayment: parseFloat(providerPayment)
      })

      showSuccess(`Provider assigned! Client pays: UGX ${totalPrice.toLocaleString()}, Provider receives: UGX ${parseFloat(providerPayment).toLocaleString()}`)
      setSelectedBooking(null)
      setSelectedProvider('')
      setRatePerDay('')
      setDays('')
      setProviderPayment('')
      onRefresh()
    } catch (error) {
      showError('Failed to assign provider. Please try again.')
    } finally {
      setAssignmentLoading(false)
    }
  }

  const resetModal = () => {
    setSelectedBooking(null)
    setSelectedProvider('')
    setRatePerDay('')
    setDays('')
    setProviderPayment('')
  }

  const getServiceIcon = (serviceType) => {
    return ''
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return '#ef4444'
      case 'urgent': return '#f59e0b'
      default: return '#10b981'
    }
  }

  const getFilteredProviders = () => {
    if (!selectedBooking) return providers

    const serviceToProviderMap = {
      'nursing': 'nurse',
      'doctor': 'doctor',
      'caregiver': 'caregiver'
    }

    const requiredType = serviceToProviderMap[selectedBooking.service_type]
    return providers.filter(provider => provider.provider_type === requiredType)
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>Pending Bookings ({bookings.length})</h3>
        <button className="btn btn-primary btn-small" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px'}}>
          <h4 style={{color: '#1f2937', marginBottom: '8px'}}>All caught up!</h4>
          <p style={{color: '#6b7280'}}>No pending bookings require attention.</p>
        </div>
      ) : (
        <div>
          {bookings.map(booking => (
            <div key={booking.id} className="card" style={{
              marginBottom: '20px', 
              backgroundColor: '#fef3c7', 
              border: '2px solid #fbbf24'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px'}}>
                <div style={{flex: '1', minWidth: '300px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                    <span style={{fontSize: '1.5rem'}}>
                      {getServiceIcon(booking.service_type)}
                    </span>
                    <h4 style={{color: '#1f2937', fontSize: '1.25rem', fontWeight: '600'}}>
                      {booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)} Service
                    </h4>
                    <span style={{
                      backgroundColor: getUrgencyColor(booking.urgency),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {booking.urgency}
                    </span>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px'}}>
                    <div>
                      <strong style={{color: '#374151'}}>Patient:</strong>
                      <p style={{color: '#6b7280', margin: '4px 0'}}>{booking.patient_name}</p>
                      <p style={{color: '#6b7280', margin: '4px 0', fontSize: '0.875rem'}}>{booking.patient_email}</p>
                    </div>
                    <div>
                      <strong style={{color: '#374151'}}>Phone:</strong>
                      <p style={{color: '#6b7280', margin: '4px 0'}}>{booking.phone_number}</p>
                    </div>
                    <div>
                      <strong style={{color: '#374151'}}>Preferred Date:</strong>
                      <p style={{color: '#6b7280', margin: '4px 0'}}>{new Date(booking.preferred_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <strong style={{color: '#374151'}}>Submitted:</strong>
                      <p style={{color: '#6b7280', margin: '4px 0'}}>{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '16px'}}>
                    <strong style={{color: '#374151'}}>Location:</strong>
                    <p style={{color: '#6b7280', margin: '4px 0'}}>{booking.location}</p>
                  </div>
                  
                  <div style={{marginBottom: '16px'}}>
                    <strong style={{color: '#374151'}}>Description:</strong>
                    <p style={{color: '#6b7280', margin: '4px 0', lineHeight: '1.5'}}>{booking.description}</p>
                  </div>
                </div>
                
                <div style={{textAlign: 'right', minWidth: '150px'}}>
                  <button 
                    onClick={() => setSelectedBooking(booking)}
                    className="btn btn-success"
                    style={{fontSize: '0.9rem'}}
                  >
                    Assign Provider
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{marginBottom: '20px', color: '#1f2937'}}>Assign Healthcare Provider</h3>
            
            <div style={{marginBottom: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
              <h4 style={{color: '#1f2937', marginBottom: '8px'}}>Booking Details:</h4>
              <p><strong>Service:</strong> {selectedBooking.service_type}</p>
              <p><strong>Patient:</strong> {selectedBooking.patient_name}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone_number}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.preferred_date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {selectedBooking.location}</p>
              <p><strong>Urgency:</strong> <span style={{
                color: getUrgencyColor(selectedBooking.urgency),
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>{selectedBooking.urgency}</span></p>
            </div>
            
            <div className="form-group">
              <label>Select Qualified Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                disabled={assignmentLoading}
              >
                <option value="">Choose a provider...</option>
                {getFilteredProviders().map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.provider_type} ({provider.email})
                  </option>
                ))}
              </select>
              {getFilteredProviders().length === 0 && (
                <small style={{color: '#ef4444', display: 'block', marginTop: '4px'}}>
                  No qualified providers available for this service type.
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Rate Per Day (UGX)</label>
              <div style={{position: 'relative'}}>
                <input
                  type="number"
                  value={ratePerDay}
                  onChange={(e) => setRatePerDay(e.target.value)}
                  placeholder="Enter daily rate"
                  disabled={assignmentLoading}
                  min="0"
                  step="1000"
                  style={{paddingLeft: '50px'}}
                />
                <span style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#6b7280', fontWeight: '500'
                }}>UGX</span>
              </div>
            </div>

            <div className="form-group">
              <label>Number of Days</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Enter number of days"
                disabled={assignmentLoading}
                min="1"
                step="1"
              />
            </div>

            {ratePerDay && days && (
              <div style={{
                padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px',
                border: '2px solid #3b82f6', marginBottom: '16px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#1e40af', fontWeight: '600'}}>Client Total (Rate × Days):</span>
                  <span style={{color: '#1e40af', fontWeight: '700', fontSize: '1.25rem'}}>
                    UGX {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '4px'}}>
                  {days} day(s) × UGX {parseFloat(ratePerDay).toLocaleString()}/day
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Provider Payment (UGX)</label>
              <div style={{position: 'relative'}}>
                <input
                  type="number"
                  value={providerPayment}
                  onChange={(e) => setProviderPayment(e.target.value)}
                  placeholder="Enter amount provider will receive"
                  disabled={assignmentLoading}
                  min="0"
                  step="1000"
                  style={{paddingLeft: '50px'}}
                />
                <span style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#6b7280', fontWeight: '500'
                }}>UGX</span>
              </div>
              <small style={{color: '#6b7280', display: 'block', marginTop: '4px'}}>
                This is the amount the provider will see and receive (can be different from client price)
              </small>
            </div>

            {providerPayment && (
              <div style={{
                padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px',
                border: '2px solid #10b981', marginBottom: '16px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#065f46', fontWeight: '600'}}>Provider Will Receive:</span>
                  <span style={{color: '#065f46', fontWeight: '700', fontSize: '1.25rem'}}>
                    UGX {parseFloat(providerPayment).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
              <button 
                onClick={assignProvider}
                className="btn btn-success"
                disabled={!selectedProvider || !ratePerDay || !days || !providerPayment || assignmentLoading}
                style={{flex: 1}}
              >
                {assignmentLoading ? <LoadingSpinner size="small" text="Assigning..." /> : 'Assign Provider'}
              </button>
              <button 
                onClick={resetModal}
                className="btn btn-outline"
                disabled={assignmentLoading}
                style={{flex: 1}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingBookings