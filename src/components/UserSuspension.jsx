import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../config/api'

function UserSuspension({ onRefresh }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/users/all')
      setUsers(response.data)
    } catch (error) {
      showError('Failed to load users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const suspendUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to suspend ${userName}? They will not be able to login.`)) {
      return
    }

    setActionLoading(prev => ({ ...prev, [userId]: 'suspending' }))
    try {
      await api.post(`/admin/users/${userId}/suspend`)
      showSuccess(`${userName} has been suspended`)
      fetchUsers()
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to suspend user')
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }))
    }
  }

  const activateUser = async (userId, userName) => {
    setActionLoading(prev => ({ ...prev, [userId]: 'activating' }))
    try {
      await api.post(`/admin/users/${userId}/activate`)
      showSuccess(`${userName} has been activated`)
      fetchUsers()
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to activate user')
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }))
    }
  }

  const deleteUser = async () => {
    if (!selectedUser) return

    if (deleteConfirmation !== 'DELETE') {
      return showError('Please type DELETE to confirm')
    }

    setActionLoading(prev => ({ ...prev, [selectedUser.id]: 'deleting' }))
    try {
      await api.delete(`/admin/users/${selectedUser.id}`)
      showSuccess(`${selectedUser.name} has been permanently deleted`)
      setSelectedUser(null)
      setDeleteConfirmation('')
      fetchUsers()
      if (onRefresh) onRefresh()
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to delete user')
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedUser.id]: null }))
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: { backgroundColor: '#d1fae5', color: '#065f46' },
      suspended: { backgroundColor: '#fee2e2', color: '#991b1b' },
      pending: { backgroundColor: '#fef3c7', color: '#92400e' }
    }
    return styles[status] || styles.active
  }

  const getRoleBadge = (role) => {
    const styles = {
      patient: { backgroundColor: '#dbeafe', color: '#1e40af' },
      provider: { backgroundColor: '#d1fae5', color: '#065f46' },
      admin: { backgroundColor: '#fee2e2', color: '#991b1b' }
    }
    return styles[role] || styles.patient
  }

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery)
    
    return matchesRole && matchesStatus && matchesSearch
  })

  if (loading) {
    return <LoadingSpinner size="large" text="Loading users..." />
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>User Suspension & Management</h3>
        <button className="btn btn-primary btn-small" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{marginBottom: '24px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div className="form-group" style={{marginBottom: 0}}>
            <label>Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, email, or ID..."
            />
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <label>Filter by Role</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="provider">Providers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <label>Filter by Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>
          Users ({filteredUsers.length})
        </h4>
        
        {filteredUsers.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <h4 style={{color: '#1f2937', marginBottom: '8px'}}>No users found</h4>
            <p style={{color: '#6b7280'}}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{fontWeight: '500', color: '#6b7280'}}>#{user.id}</td>
                    <td style={{fontWeight: '500'}}>{user.name}</td>
                    <td style={{color: '#6b7280'}}>{user.email}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        ...getRoleBadge(user.role)
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        ...getStatusBadge(user.status)
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{color: '#6b7280', fontSize: '0.875rem'}}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '8px'}}>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => suspendUser(user.id, user.name)}
                            className="btn btn-warning btn-small"
                            disabled={actionLoading[user.id]}
                          >
                            {actionLoading[user.id] === 'suspending' ? 'Suspending...' : 'Suspend'}
                          </button>
                        ) : (
                          <button
                            onClick={() => activateUser(user.id, user.name)}
                            className="btn btn-success btn-small"
                            disabled={actionLoading[user.id]}
                          >
                            {actionLoading[user.id] === 'activating' ? 'Activating...' : 'Activate'}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-danger btn-small"
                          disabled={actionLoading[user.id]}
                        >
                          Delete
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

      {/* Delete Confirmation Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{marginBottom: '20px', color: '#dc2626'}}>⚠️ Delete User</h3>
            
            <div style={{marginBottom: '20px', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '2px solid #dc2626'}}>
              <p style={{color: '#991b1b', fontWeight: '600', marginBottom: '8px'}}>
                WARNING: This action cannot be undone!
              </p>
              <p style={{color: '#7f1d1d', fontSize: '0.875rem'}}>
                You are about to permanently delete:
              </p>
              <div style={{marginTop: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '6px'}}>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>ID:</strong> #{selectedUser.id}</p>
              </div>
            </div>

            <div className="form-group">
              <label>Type DELETE to confirm</label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE in capital letters"
                disabled={actionLoading[selectedUser.id]}
              />
            </div>

            <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
              <button 
                onClick={deleteUser}
                className="btn btn-danger"
                disabled={deleteConfirmation !== 'DELETE' || actionLoading[selectedUser.id]}
                style={{flex: 1}}
              >
                {actionLoading[selectedUser.id] === 'deleting' ? <LoadingSpinner size="small" text="Deleting..." /> : 'Delete Permanently'}
              </button>
              <button 
                onClick={() => {
                  setSelectedUser(null)
                  setDeleteConfirmation('')
                }}
                className="btn btn-outline"
                disabled={actionLoading[selectedUser.id]}
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

export default UserSuspension
