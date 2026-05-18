function UserManagement({ stats, providers, onRefresh }) {
  const userData = stats.usersByRole || {}
  
  const userStats = [
    { 
      type: 'Patients', 
      count: userData.patient || 0, 
      color: '#667eea',
      description: 'Users who book healthcare services'
    },
    { 
      type: 'Providers', 
      count: userData.provider || 0, 
      color: '#11998e',
      description: 'Healthcare professionals offering services'
    },
    { 
      type: 'Admins', 
      count: userData.admin || 0, 
      color: '#ff6b6b',
      description: 'System administrators'
    }
  ]

  const providerBreakdown = providers.reduce((acc, provider) => {
    acc[provider.provider_type] = (acc[provider.provider_type] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={{color: '#1f2937'}}>User Management</h3>
        <button className="btn btn-primary btn-small" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {/* User Statistics */}
      <div className="stats-grid" style={{marginBottom: '32px'}}>
        {userStats.map(stat => (
          <div key={stat.type} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-number" style={{color: stat.color}}>{stat.count}</span>
            <span className="stat-label">{stat.type}</span>
            <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', textAlign: 'center'}}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Provider Breakdown */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px'}}>
        <div className="card">
          <h4 style={{marginBottom: '16px', color: '#1f2937'}}>Provider Specializations</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{color: '#374151'}}>Nurses</span>
              </div>
              <span style={{fontWeight: '600', color: '#1f2937'}}>{providerBreakdown.nurse || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{color: '#374151'}}>Doctors</span>
              </div>
              <span style={{fontWeight: '600', color: '#1f2937'}}>{providerBreakdown.doctor || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{color: '#374151'}}>Caregivers</span>
              </div>
              <span style={{fontWeight: '600', color: '#1f2937'}}>{providerBreakdown.caregiver || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 style={{marginBottom: '16px', color: '#1f2937'}}>User Growth Insights</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px'}}>
              <p style={{fontSize: '0.875rem', color: '#1e40af', margin: 0}}>
                <strong>Patient to Provider Ratio:</strong> {userData.patient && userData.provider ? Math.round(userData.patient / userData.provider) : 0}:1
              </p>
            </div>
            <div style={{padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px'}}>
              <p style={{fontSize: '0.875rem', color: '#166534', margin: 0}}>
                <strong>Total Active Users:</strong> {(userData.patient || 0) + (userData.provider || 0)}
              </p>
            </div>
            <div style={{padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px'}}>
              <p style={{fontSize: '0.875rem', color: '#92400e', margin: 0}}>
                <strong>System Coverage:</strong> {providers.length > 5 ? 'Excellent' : providers.length > 2 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>Active Providers</h4>
        {providers.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <h4 style={{color: '#1f2937', marginBottom: '8px'}}>No providers registered</h4>
            <p style={{color: '#6b7280'}}>Encourage healthcare professionals to join the platform.</p>
          </div>
        ) : (
          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider.id}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontWeight: '500'}}>{provider.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        textTransform: 'capitalize'
                      }}>
                        {provider.provider_type}
                      </span>
                    </td>
                    <td style={{color: '#6b7280'}}>{provider.email}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: '#d1fae5',
                        color: '#065f46'
                      }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Management Actions */}
      <div className="card">
        <h4 style={{marginBottom: '16px', color: '#1f2937'}}>⚙️ Management Actions</h4>
        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
          <button className="btn btn-outline">
            Export User Data
          </button>
          <button className="btn btn-outline">
            Send Notifications
          </button>
          <button className="btn btn-outline">
            Advanced Search
          </button>
          <button className="btn btn-warning">
            Manage Suspensions
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement