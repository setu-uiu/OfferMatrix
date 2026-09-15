import { Navigate } from 'react-router-dom'

function isTokenValid(token) {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('om_admin_token')

  if (!isTokenValid(token)) {
    localStorage.removeItem('om_admin_token')
    localStorage.removeItem('om_admin_user')
    return <Navigate to="/login" replace />
  }

  return children
}


