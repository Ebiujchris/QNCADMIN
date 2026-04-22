import { Link } from 'react-router-dom'

function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/images/new site logo.jpg" alt="QNC Admin" className="logo-image" />
          <span className="logo-text">QNC ADMIN PANEL</span>
        </Link>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          {user ? (
            <>
              <span className="user-info">Admin: {user.name}</span>
              <Link to="/dashboard" className="btn btn-outline btn-small" style={{textDecoration: 'none'}}>
                Dashboard
              </Link>
              <button onClick={logout} className="btn btn-danger btn-small">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-small" style={{textDecoration: 'none'}}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-small" style={{textDecoration: 'none'}}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar