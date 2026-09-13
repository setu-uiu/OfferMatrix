import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ScraperHealth from './pages/ScraperHealth'
import DealQueue from './pages/DealQueue'
import Affiliates from './pages/Affiliates'
import FraudReports from './pages/FraudReports'
import PlatformAnalytics from './pages/PlatformAnalytics'
import SearchTrends from './pages/SearchTrends'
import AlertManager from './pages/AlertManager'
import UserManagement from './pages/UserManagement'
import Settings from './pages/Settings'
import OfferMatrix from './pages/OfferMatrix'
import Complaints from './pages/Complaints'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scraper-health" element={<ScraperHealth />} />
        <Route path="/deal-queue" element={<DealQueue />} />
        <Route path="/affiliates" element={<Affiliates />} />
        <Route path="/fraud-reports" element={<FraudReports />} />
        <Route path="/analytics" element={<PlatformAnalytics />} />
        <Route path="/search-trends" element={<SearchTrends />} />
        <Route path="/alerts" element={<AlertManager />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/offer-matrix" element={<OfferMatrix />} />
        <Route path="/complaints" element={<Complaints />} />
      </Route>
    </Routes>
  )
}
