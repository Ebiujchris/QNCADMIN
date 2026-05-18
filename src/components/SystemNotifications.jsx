import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function SystemNotifications({ onRefresh }) {
  const [recipientType, setRecipientType] = useState('all')
  const [customUserId, setCustomUserId] = useState('')
  const [message, setMessage] = useState('')
  const [notificationType, setNotificationType] = useState('general')
  const [sending, setSending] = useState(false)
  const { showSuccess, showError } = useToast()

  const sendNotification = async () => {
    if (!message.trim()) {
      return showError('Please enter a notification message')
    }

    if (recipientType === 'custom' && !customUserId.trim()) {
      return showError('Please enter a user ID for custom notification')
    }

    setSending(true)
    try {
      await api.post('/admin/notifications/send', {
        recipientType,
        customUserId: recipientType === 'custom' ? customUserId : null,
        message: message.trim(),
        notificationType
      })

      showSuccess(`Notification sent successfully to ${recipientType === 'all' ? 'all users' : recipientType}!`)
      setMessage('')
      setCustomUserId('')
      setRecipientType('all')
      setNotificationType('general')
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>Send System Notifications</h3>
      </div>

      <div className="card" style={{marginBottom: '24px'}}>
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>Broadcast Message</h4>
        
        <div className="form-group">
          <label>Recipients</label>
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            disabled={sending}
          >
            <option value="all">All Users</option>
            <option value="patient">All Patients</option>
            <option value="provider">All Providers</option>
            <option value="admin">All Admins</option>
            <option value="custom">Specific User (by ID)</option>
          </select>
        </div>

        {recipientType === 'custom' && (
          <div className="form-group">
            <label>User ID</label>
            <input
              type="number"
              value={customUserId}
              onChange={(e) => setCustomUserId(e.target.value)}
              placeholder="Enter user ID"
              disabled={sending}
            />
            <small style={{color: '#6b7280', display: 'block', marginTop: '4px'}}>
              You can find user IDs in the User Management section
            </small>
          </div>
        )}

        <div className="form-group">
          <label>Notification Type</label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            disabled={sending}
          >
            <option value="general">General</option>
            <option value="announcement">Announcement</option>
            <option value="warning">Warning</option>
            <option value="maintenance">Maintenance</option>
            <option value="update">System Update</option>
          </select>
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your notification message..."
            rows="5"
            disabled={sending}
            style={{resize: 'vertical'}}
          />
          <small style={{color: '#6b7280', display: 'block', marginTop: '4px'}}>
            {message.length} characters
          </small>
        </div>

        <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
          <button 
            onClick={sendNotification}
            className="btn btn-primary"
            disabled={sending || !message.trim()}
          >
            {sending ? <LoadingSpinner size="small" text="Sending..." /> : 'Send Notification'}
          </button>
          <button 
            onClick={() => {
              setMessage('')
              setCustomUserId('')
              setRecipientType('all')
              setNotificationType('general')
            }}
            className="btn btn-outline"
            disabled={sending}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>Quick Templates</h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px'}}>
          <button 
            className="btn btn-outline"
            onClick={() => setMessage('System maintenance scheduled for tonight at 11 PM. Services may be temporarily unavailable.')}
            disabled={sending}
          >
            Maintenance Notice
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setMessage('New features have been added to the platform! Check out the latest updates in your dashboard.')}
            disabled={sending}
          >
            Feature Update
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setMessage('Thank you for being part of QNC Solutions! We appreciate your continued support.')}
            disabled={sending}
          >
            Thank You Message
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setMessage('Important: Please update your profile information to ensure accurate service delivery.')}
            disabled={sending}
          >
            Profile Update Reminder
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemNotifications
