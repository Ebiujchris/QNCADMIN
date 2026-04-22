import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import axios from 'axios'

function PaymentManagement({ stats, onRefresh }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const { showError } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/payments/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPayments(response.data)
    } catch (error) {
      showError('Failed to load payment data')
      console.error('Payment fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const paymentStats = {
    totalRevenue: stats.totalRevenue || 0,
    totalPayments: stats.totalPayments || 0,
    averagePayment: stats.totalPayments > 0 ? (stats.totalRevenue / stats.totalPayments).toFixed(2) : 0
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>💰 Payment Management</h3>
        <div style={{display: 'flex', gap: '8px'}}>
          <button className="btn btn-outline btn-small" onClick={fetchPayments}>
            🔄 Refresh
          </button>
          <button className="btn btn-success btn-small">
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="stats-grid" style={{marginBottom: '32px'}}>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <span className="stat-number">UGX {paymentStats.totalRevenue.toLocaleString()}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-number">{paymentStats.totalPayments}</span>
          <span className="stat-label">Total Payments</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💵</span>
          <span className="stat-number">UGX {parseFloat(paymentStats.averagePayment).toLocaleString()}</span>
          <span className="stat-label">Average Payment</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <span className="stat-number">{payments.filter(p => {
            const paymentDate = new Date(p.payment_date)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            return paymentDate >= thirtyDaysAgo
          }).length}</span>
          <span className="stat-label">Last 30 Days</span>
        </div>
      </div>

      {/* Revenue Insights */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px'}}>
        <div className="card">
          <h4 style={{marginBottom: '16px', color: '#1f2937'}}>📈 Revenue Insights</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px'}}>
              <p style={{fontSize: '0.875rem', color: '#166534', margin: 0}}>
                <strong>Revenue Growth:</strong> {paymentStats.totalRevenue > 1000 ? 'Excellent' : paymentStats.totalRevenue > 500 ? 'Good' : 'Growing'}
              </p>
            </div>
            <div style={{padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px'}}>
              <p style={{fontSize: '0.875rem', color: '#1e40af', margin: 0}}>
                <strong>Payment Rate:</strong> {stats.bookingsByStatus?.paid && stats.totalBookings ? 
                  Math.round((stats.bookingsByStatus.paid / stats.totalBookings) * 100) : 0}% of bookings paid
              </p>
            </div>
            <div style={{padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px'}}>
              <p style={{fontSize: '0.875rem', color: '#92400e', margin: 0}}>
                <strong>Service Value:</strong> UGX 50,000+ per completed service
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 style={{marginBottom: '16px', color: '#1f2937'}}>💳 Payment Methods</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>💳</span>
                <span style={{color: '#374151'}}>Manual Payment</span>
              </div>
              <span style={{fontWeight: '600', color: '#1f2937'}}>{payments.length}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>🏦</span>
                <span style={{color: '#374151'}}>Bank Transfer</span>
              </div>
              <span style={{fontWeight: '600', color: '#6b7280'}}>Coming Soon</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>📱</span>
                <span style={{color: '#374151'}}>Mobile Payment</span>
              </div>
              <span style={{fontWeight: '600', color: '#6b7280'}}>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>📋 Payment History</h4>
        {loading ? (
          <LoadingSpinner text="Loading payment history..." />
        ) : payments.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px 20px'}}>
            <span style={{fontSize: '4rem', display: 'block', marginBottom: '16px'}}>💰</span>
            <h4 style={{color: '#1f2937', marginBottom: '8px'}}>No payments recorded</h4>
            <p style={{color: '#6b7280'}}>Payments will appear here once services are completed and paid.</p>
          </div>
        ) : (
          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td style={{fontFamily: 'monospace', color: '#6b7280'}}>
                      #{payment.id}
                    </td>
                    <td>
                      <div>
                        <div style={{fontWeight: '500'}}>{payment.patient_name}</div>
                        <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                          Booking #{payment.booking_id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>
                          {payment.service_type === 'nursing' ? '🏥' : 
                           payment.service_type === 'doctor' ? '👨‍⚕️' : '🤝'}
                        </span>
                        <span style={{textTransform: 'capitalize'}}>{payment.service_type}</span>
                      </div>
                    </td>
                    <td style={{fontWeight: '600', color: '#10b981'}}>
                      UGX {parseFloat(payment.amount).toLocaleString()}
                    </td>
                    <td style={{color: '#6b7280'}}>
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: payment.status === 'paid' ? '#d1fae5' : '#fee2e2',
                        color: payment.status === 'paid' ? '#065f46' : '#991b1b',
                        textTransform: 'uppercase'
                      }}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Management Actions */}
      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>⚙️ Payment Actions</h4>
        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
          <button className="btn btn-success">
            💰 Process Refund
          </button>
          <button className="btn btn-outline">
            📊 Generate Invoice
          </button>
          <button className="btn btn-outline">
            📧 Send Payment Reminder
          </button>
          <button className="btn btn-warning">
            ⚠️ Flag Disputed Payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentManagement