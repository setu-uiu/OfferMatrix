import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT ────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('om_admin_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401/403 ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('om_admin_token')
      localStorage.removeItem('om_admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api


