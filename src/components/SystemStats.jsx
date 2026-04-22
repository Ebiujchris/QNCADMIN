function SystemStats({ stats, pendingCount, providersCount, adminRequestsCount }) {
  const getStatusBreakdown = () => {
    const statusData = stats.bookingsByStatus || {}
    return [
      { label: 'Pending', value: statusData.pending || 0, color: '#fbbf24', icon: '⏳' },
      { label: 'Assigned', value: statusData.assigned || 0, color: '#3b82f6', icon: '👩‍⚕️' },
      { label: 'Paid', value: statusData.paid || 0, color: '#10b981', icon: '💳' },
      { label: 'Completed', value: statusData.completed || 0, color: '#6b7280', icon: '✅' }
    ]
  }

  const getUserBreakdown = () => {
    const userData = stats.usersByRole || {}
    return [
      { label: 'Patients', value: userData.patient || 0, color: '#667eea', icon: '🏥' },
      { label: 'Providers', value: userData.provider || 0, color: '#11998e', icon: '👩‍⚕️' },
      { label: 'Admins', value: userData.admin || 0, color: '#ff6b6b', icon: '🛡️' }
    ]
  }

  return (
    <div>
      <h3 style={{marginBottom: '24px', color: '#1f2937'}}>📊 System Overview</h3>
      
      {/* Key Metrics */}
      <div className="stats-grid" style={{marginBottom: '32px'}}>
        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <span className="stat-number">{stats.totalBookings || 0}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚡</span>
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Needs Attention</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔐</span>
          <span className="stat-number">{adminRequestsCount || 0}</span>
          <span className="stat-label">Admin Requests</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <span className="stat-number">UGX {(stats.totalRevenue || 0).toLocaleString()}</span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px'}}>
        <div className="card">
          <h4 style={{marginBottom: '16px', color: '#1f2937'}}>📋 Booking Status Breakdown</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {getStatusBreakdown().map(item => (
              <div key={item.label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>{item.icon}</span>
                  <span style={{color: '#374151'}}>{item.label}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{
                    width: '60px',
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${stats.totalBookings ? (item.value / stats.totalBookings) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{fontWeight: '600', color: '#1f2937', minWidth: '30px'}}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 style={{marginBottom: '16px', color: '#1f2937'}}>👥 User Distribution</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {getUserBreakdown().map(item => (
              <div key={item.label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>{item.icon}</span>
                  <span style={{color: '#374151'}}>{item.label}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{
                    width: '60px',
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.value > 0 ? Math.max((item.value / 10) * 100, 10) : 0}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{fontWeight: '600', color: '#1f2937', minWidth: '30px'}}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>📈 System Health</h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div style={{textAlign: 'center', padding: '16px'}}>
            <div style={{fontSize: '2rem', marginBottom: '8px'}}>
              {pendingCount === 0 ? '✅' : pendingCount < 5 ? '⚠️' : '🚨'}
            </div>
            <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
              {pendingCount === 0 ? 'All Clear' : pendingCount < 5 ? 'Manageable Load' : 'High Priority'}
            </div>
          </div>
          <div style={{textAlign: 'center', padding: '16px'}}>
            <div style={{fontSize: '2rem', marginBottom: '8px'}}>
              {providersCount > 5 ? '💪' : providersCount > 2 ? '👍' : '⚠️'}
            </div>
            <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
              {providersCount > 5 ? 'Strong Network' : providersCount > 2 ? 'Good Coverage' : 'Need More Providers'}
            </div>
          </div>
          <div style={{textAlign: 'center', padding: '16px'}}>
            <div style={{fontSize: '2rem', marginBottom: '8px'}}>
              {stats.totalRevenue > 1000 ? '💰' : stats.totalRevenue > 500 ? '💵' : '📈'}
            </div>
            <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
              {stats.totalRevenue > 1000 ? 'Excellent Revenue' : stats.totalRevenue > 500 ? 'Growing Revenue' : 'Building Revenue'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStats