import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function PaymentManagement({ stats, onRefresh }) {
  const [payments, setPayments] = useState([])
  const [unpaid, setUnpaid] = useState([])
  const [loading, setLoading] = useState(true)
  const [reminderLoading, setReminderLoading] = useState({})
  const [invoiceData, setInvoiceData] = useState(null)
  const [invoiceType, setInvoiceType] = useState('invoice') // 'invoice' | 'receipt'
  const { showSuccess, showError } = useToast()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [histRes, unpaidRes] = await Promise.all([
        api.get('/payments/history'),
        api.get('/payments/unpaid')
      ])
      setPayments(histRes.data)
      setUnpaid(unpaidRes.data)
    } catch (error) {
      showError('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  const sendReminder = async (bookingId, patientName) => {
    setReminderLoading(prev => ({ ...prev, [bookingId]: true }))
    try {
      const res = await api.post(`/payments/send-reminder/${bookingId}`)
      showSuccess(res.data.message)
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send reminder')
    } finally {
      setReminderLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  const openDocument = async (bookingId, type) => {
    try {
      const res = await api.get(`/payments/invoice/${bookingId}`)
      setInvoiceData(res.data)
      setInvoiceType(type)
    } catch (error) {
      showError('Failed to load document data')
    }
  }

  const printDocument = () => {
    window.print()
  }

  const paymentStats = {
    totalRevenue: stats.totalRevenue || 0,
    totalPayments: stats.totalPayments || 0,
    averagePayment: stats.totalPayments > 0 ? (stats.totalRevenue / stats.totalPayments).toFixed(2) : 0,
    perPatient: stats.perPatientRevenue || []
  }

  // Invoice / Receipt Modal
  if (invoiceData) {
    const isPaid = invoiceData.payment_status === 'paid'
    const isReceipt = invoiceType === 'receipt'
    return (
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }} className="no-print">
          <button className="btn btn-outline" onClick={() => setInvoiceData(null)}>← Back</button>
          <button className="btn btn-primary" onClick={printDocument}>🖨️ Print / Save as PDF</button>
        </div>

        {/* Printable Document */}
        <div id="printable-doc" style={{
          maxWidth: '700px', margin: '0 auto', background: 'white',
          padding: '48px', border: '1px solid #e5e7eb', borderRadius: '12px',
          fontFamily: 'Arial, sans-serif'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e40af', margin: 0 }}>QNC Solutions</h1>
              <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '0.9rem' }}>Healthcare Services</p>
              <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '0.85rem' }}>qncsolutions3@gmail.com</p>
              <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '0.85rem' }}>+256-791-785931</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: isReceipt ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#1e40af,#7c2d12)',
                color: 'white', padding: '8px 20px', borderRadius: '8px',
                fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px'
              }}>
                {isReceipt ? '✅ RECEIPT' : '📄 INVOICE'}
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0' }}>
                #{isReceipt ? 'RCP' : 'INV'}-{String(invoiceData.id).padStart(4, '0')}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '2px 0' }}>
                Date: {new Date().toLocaleDateString()}
              </p>
              {isReceipt && invoiceData.payment_date && (
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '2px 0' }}>
                  Paid: {new Date(invoiceData.payment_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Bill To */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Bill To
            </p>
            <p style={{ fontWeight: '700', color: '#1f2937', margin: '0 0 4px', fontSize: '1.05rem' }}>{invoiceData.patient_name}</p>
            <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '0.9rem' }}>{invoiceData.patient_email}</p>
            {invoiceData.patient_phone && <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '0.9rem' }}>{invoiceData.patient_phone}</p>}
          </div>

          {/* Service Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Days</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Rate/Day</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                  <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px', textTransform: 'capitalize' }}>
                    {invoiceData.service_type} Service
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '2px 0' }}>Provider: {invoiceData.provider_name || 'Assigned'}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '2px 0' }}>Location: {invoiceData.location}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '2px 0' }}>
                    Service Date: {new Date(invoiceData.preferred_date).toLocaleDateString()}
                  </p>
                </td>
                <td style={{ padding: '16px', textAlign: 'center', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
                  {invoiceData.days || 1}
                </td>
                <td style={{ padding: '16px', textAlign: 'right', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
                  UGX {invoiceData.rate_per_day ? parseFloat(invoiceData.rate_per_day).toLocaleString() : parseFloat(invoiceData.price).toLocaleString()}
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#1f2937', borderBottom: '1px solid #f3f4f6' }}>
                  UGX {parseFloat(invoiceData.price).toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ padding: '16px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: '#1f2937' }}>Total</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', fontSize: '1.2rem', color: isReceipt ? '#10b981' : '#1e40af' }}>
                  UGX {parseFloat(invoiceData.price).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Status */}
          <div style={{
            padding: '16px', borderRadius: '8px', textAlign: 'center',
            background: isPaid ? '#ecfdf5' : '#fef3c7',
            border: `1px solid ${isPaid ? '#d1fae5' : '#fbbf24'}`
          }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: isPaid ? '#065f46' : '#92400e' }}>
              {isPaid ? '✅ PAYMENT CONFIRMED' : '⏳ PAYMENT PENDING'}
            </p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
              Thank you for choosing QNC Solutions. For queries contact qncsolutions3@gmail.com
            </p>
          </div>
        </div>

        <style>{`@media print { .no-print { display: none !important; } }`}</style>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1f2937' }}>💰 Payment Management</h3>
        <button className="btn btn-outline btn-small" onClick={fetchAll}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <span className="stat-number">UGX {paymentStats.totalRevenue.toLocaleString()}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-number">{paymentStats.totalPayments}</span>
          <span className="stat-label">Paid Invoices</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <span className="stat-number">{unpaid.length}</span>
          <span className="stat-label">Pending Payments</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💵</span>
          <span className="stat-number">UGX {parseFloat(paymentStats.averagePayment).toLocaleString()}</span>
          <span className="stat-label">Average Payment</span>
        </div>
      </div>

      {/* Pending Payments — Send Reminders */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px', color: '#1f2937' }}>⏳ Pending Payments — Send Reminders</h4>
        {unpaid.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>✅ No outstanding payments.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Amount Due</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unpaid.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{b.patient_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.patient_email}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {b.service_type}
                      {b.days && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.days} day(s)</div>}
                    </td>
                    <td style={{ fontWeight: '700', color: '#dc2626' }}>
                      UGX {parseFloat(b.price).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-warning btn-small"
                          onClick={() => sendReminder(b.id, b.patient_name)}
                          disabled={reminderLoading[b.id]}
                        >
                          {reminderLoading[b.id] ? '⏳...' : '📧 Remind'}
                        </button>
                        <button
                          className="btn btn-outline btn-small"
                          onClick={() => openDocument(b.id, 'invoice')}
                        >
                          📄 Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per-Patient Revenue */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px', color: '#1f2937' }}>👥 Per-Patient Revenue</h4>
        {paymentStats.perPatient.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No billing data yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Bookings</th>
                  <th>Total Billed</th>
                  <th>Total Paid</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {paymentStats.perPatient.map((p, i) => {
                  const outstanding = parseFloat(p.total_billed) - parseFloat(p.total_paid)
                  return (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{p.patient_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.patient_email}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{p.booking_count}</td>
                      <td style={{ fontWeight: '600', color: '#1f2937' }}>UGX {parseFloat(p.total_billed).toLocaleString()}</td>
                      <td style={{ fontWeight: '600', color: '#10b981' }}>UGX {parseFloat(p.total_paid).toLocaleString()}</td>
                      <td style={{ fontWeight: '600', color: outstanding > 0 ? '#ef4444' : '#10b981' }}>
                        {outstanding > 0 ? `UGX ${outstanding.toLocaleString()}` : '✅ Cleared'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f8fafc', fontWeight: '700' }}>
                  <td>Total</td>
                  <td style={{ textAlign: 'center' }}>{paymentStats.perPatient.reduce((s, p) => s + parseInt(p.booking_count), 0)}</td>
                  <td style={{ color: '#1f2937' }}>UGX {paymentStats.perPatient.reduce((s, p) => s + parseFloat(p.total_billed), 0).toLocaleString()}</td>
                  <td style={{ color: '#10b981' }}>UGX {paymentStats.perPatient.reduce((s, p) => s + parseFloat(p.total_paid), 0).toLocaleString()}</td>
                  <td style={{ color: '#ef4444' }}>UGX {paymentStats.perPatient.reduce((s, p) => s + (parseFloat(p.total_billed) - parseFloat(p.total_paid)), 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Payment History with Receipt buttons */}
      <div className="card">
        <h4 style={{ marginBottom: '16px', color: '#1f2937' }}>📋 Payment History</h4>
        {loading ? (
          <LoadingSpinner text="Loading..." />
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>💰</span>
            <p style={{ color: '#6b7280' }}>No payments recorded yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', color: '#6b7280' }}>#{p.id}</td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{p.patient_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Booking #{p.booking_id}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {p.service_type}
                      {p.days && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.days} day(s)</div>}
                    </td>
                    <td style={{ fontWeight: '600', color: '#10b981' }}>UGX {parseFloat(p.amount).toLocaleString()}</td>
                    <td style={{ color: '#6b7280' }}>
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '500',
                        backgroundColor: p.status === 'paid' ? '#d1fae5' : '#fee2e2',
                        color: p.status === 'paid' ? '#065f46' : '#991b1b', textTransform: 'uppercase'
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {p.status === 'paid' ? (
                          <button
                            className="btn btn-success btn-small"
                            onClick={() => openDocument(p.booking_id, 'receipt')}
                          >
                            🧾 Receipt
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline btn-small"
                            onClick={() => openDocument(p.booking_id, 'invoice')}
                          >
                            📄 Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentManagement
