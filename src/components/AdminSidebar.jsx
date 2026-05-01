import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminSidebar({ user, activeTab, setActiveTab, tabs, logout }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1001,
          background: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer'
        }}
      >
        <div style={{width: '24px', height: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <span style={{width: '100%', height: '3px', background: '#8b5cf6', borderRadius: '2px', transition: 'all 0.3s'}}></span>
          <span style={{width: '100%', height: '3px', background: '#8b5cf6', borderRadius: '2px', transition: 'all 0.3s'}}></span>
          <span style={{width: '100%', height: '3px', background: '#8b5cf6', borderRadius: '2px', transition: 'all 0.3s'}}></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: isCollapsed ? '80px' : '280px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Logo Section */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              👑
            </div>
            {!isCollapsed && (
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                QNC Admin
              </span>
            )}
          </Link>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-collapse-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{fontSize: '1.2rem'}}>{isCollapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* User Profile Section */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              👑
            </div>
            {!isCollapsed && (
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.name}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  fontWeight: '500'
                }}>
                  Administrator
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px 12px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setIsMobileOpen(false)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                marginBottom: '8px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 45, 18, 0.1) 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {activeTab === tab.id && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
                  borderRadius: '0 4px 4px 0'
                }} />
              )}
              
              <span style={{
                fontSize: '1.3rem',
                flexShrink: 0,
                filter: activeTab === tab.id ? 'none' : 'grayscale(0.3)'
              }}>
                {tab.icon}
              </span>
              
              {!isCollapsed && (
                <>
                  <span style={{
                    flex: 1,
                    color: activeTab === tab.id ? '#1f2937' : '#64748b',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    fontSize: '0.9rem'
                  }}>
                    {tab.label}
                  </span>
                  
                  {tab.count > 0 && (
                    <span style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            <span>🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <style>{`
        .dashboard-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .dashboard-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .dashboard-sidebar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .dashboard-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </>
  )
}

export default AdminSidebar
