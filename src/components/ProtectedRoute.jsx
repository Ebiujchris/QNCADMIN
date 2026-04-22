import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, user }) {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute