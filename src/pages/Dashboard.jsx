import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import AdminSidebar from '../components/AdminSidebar'
import PendingBookings from '../components/PendingBookings'
import AllBookings from '../components/AllBookings'
import SystemStats from '../components/SystemStats'
import UserManagement from '../components/UserManagement'
import PaymentManagement from '../components/PaymentManagement'
import AdminRequests from '../components/AdminRequests'
import ProviderRequests from '../components/ProviderRequests'
import api from '../config/api'

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [pendingBookings, setPendingBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [providers, setProviders] = useState([])
  const [adminRequests, setAdminRequests] = useState([])
  const [providerRequests, setProviderRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const headers = { Authorization: `Bearer ${token}` }

      const [statsRes, pendingRes, allRes, providersRes, adminReqRes, providerReqRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings/pending'),
        api.get('/admin/bookings'),
        api.get('/admin/providers'),
        api.get('/admin/admin-requests'),
        api.get('/admin/provider-requests')
      ])

      setStats(statsRes.data)
      setPendingBookings(pendingRes.data)
      setAllBookings(allRes.data)
      setProviders(providersRes.data)
      setAdminRequests(adminReqRes.data)
      setProviderRequests(providerReqRes.data)
    } catch (error) {
      showError('Failed to load dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setLoading(true)
    fetchDashboardData()
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊', count: 0 },
    { id: 'pending', label: '🚨 Pending Bookings', icon: '🚨', count: pendingBookings.length },
    { id: 'provider-requests', label: '👩‍⚕️ Provider Apps', icon: '👩‍⚕️', count: providerRequests.length },
    { id: 'admin-requests', label: '🔐 Admin Requests', icon: '🔐', count: adminRequests.length },
    { id: 'bookings', label: '📋 All Bookings', icon: '📋', count: 0 },
    { id: 'users', label: '👥 Users', icon: '👥', count: 0 },
    { id: 'payments', label: '💰 Payments', icon: '💰', count: 0 }
  ]

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  }

  if (loading) {
    return <LoadingSpinner size="large" text="Loading admin dashboard..." />
  }

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <AdminSidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabs={tabs}
        logout={logout}
      />
      
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '32px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className="dashboard-main-content"
      >
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container">
          <h1>🛡️ QNC Solutions Admin Dashboard</h1>
          <p>Welcome back, {user.name}! Manage your healthcare system operations</p>
        </div>
      </div>

      <div className="container">
        {/* Quick Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-number">{stats.totalBookings || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🚨</span>
            <span className="stat-number">{pendingBookings.length}</span>
            <span className="stat-label">Pending Bookings</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <span className="stat-number">{(stats.usersByRole?.patient || 0) + (stats.usersByRole?.provider || 0)}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👩‍⚕️</span>
            <span className="stat-number">{providerRequests.length}</span>
            <span className="stat-label">Provider Applications</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔐</span>
            <span className="stat-number">{adminRequests.length}</span>
            <span className="stat-label">Admin Requests</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{marginBottom: '32px'}}>
          <h3 style={{marginBottom: '20px', color: '#1f2937'}}>Quick Actions</h3>
          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
            <button className="btn btn-primary" onClick={refreshData}>
              🔄 Refresh Data
            </button>
            <button className="btn btn-success" onClick={() => setActiveTab('pending')}>
              🚨 View Pending ({pendingBookings.length})
            </button>
            {providerRequests.length > 0 && (
              <button className="btn btn-info" onClick={() => setActiveTab('provider-requests')}>
                👩‍⚕️ Provider Applications ({providerRequests.length})
              </button>
            )}
            {adminRequests.length > 0 && (
              <button className="btn btn-warning" onClick={() => setActiveTab('admin-requests')}>
                🔐 Admin Requests ({adminRequests.length})
              </button>
            )}
            <button className="btn btn-warning">
              📊 Generate Report
            </button>
            <button className="btn btn-outline">
              ⚙️ System Settings
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card" style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px'}}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
                style={{position: 'relative'}}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <SystemStats 
                stats={stats} 
                pendingCount={pendingBookings.length}
                providersCount={providers.length}
                adminRequestsCount={adminRequests.length}
              />
            )}
            
            {activeTab === 'pending' && (
              <PendingBookings 
                bookings={pendingBookings}
                providers={providers}
                onRefresh={refreshData}
              />
            )}
            
            {activeTab === 'provider-requests' && (
              <ProviderRequests 
                onRefresh={refreshData}
              />
            )}
            
            {activeTab === 'admin-requests' && (
              <AdminRequests 
                onRefresh={refreshData}
              />
            )}
            
            {activeTab === 'bookings' && (
              <AllBookings 
                bookings={allBookings}
                onRefresh={refreshData}
              />
            )}
            
            {activeTab === 'users' && (
              <UserManagement 
                stats={stats}
                providers={providers}
                onRefresh={refreshData}
              />
            )}
            
            {activeTab === 'payments' && (
              <PaymentManagement 
                stats={stats}
                onRefresh={refreshData}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Dashboard