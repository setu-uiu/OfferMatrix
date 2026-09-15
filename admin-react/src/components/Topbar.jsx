import { useLocation } from 'react-router-dom'
import './Topbar.css'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'OfferMatrix Control Panel' },
  '/scraper-health': { title: 'Scraper Health', sub: 'Live crawler monitoring & API status' },
  '/deal-queue': { title: 'Community Deal Approval Queue', sub: 'Review and moderate submitted deals' },
  '/affiliates': { title: 'Affiliate Manager', sub: 'Partner commissions & performance' },
  '/fraud-reports': { title: 'Spam & Fraud Center', sub: 'Click injection & fraud telemetry' },
  '/analytics': { title: 'Platform Analytics', sub: 'Traffic, conversions & category performance' },
  '/search-trends': { title: 'Search Trends', sub: 'Trending keywords & category analytics' },
  '/alerts': { title: 'Alert & Incident Manager', sub: 'System alarms & automated diagnostics' },
  '/users': { title: 'User Management', sub: 'Manage accounts, roles & trust scores' },
  '/settings': { title: 'Admin Settings', sub: 'Platform configuration & system controls' },
  '/offer-matrix': { title: 'Offer Matrix Engine', sub: 'Dynamic discount matrix & vendor rules' },
  '/complaints': { title: 'Customer Complaints', sub: 'Resolve escalations & manage merchant disputes' },
}

export default function Topbar({ actions }) {
  const { pathname } = useLocation()
  const info = PAGE_TITLES[pathname] || { title: 'Admin Panel', sub: '' }
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('om_admin_user') || '{}') } catch { return {} }
  })()

  return (
    <div className="topbar">
      <div className="tb-title-box">
        <div className="tb-title">{info.title}</div>
        {info.sub && <div className="tb-sub">{info.sub}</div>}
      </div>
      {pathname === '/dashboard' && (
        <div className="tb-live">
          <div className="live-dot" />
          All Systems Operational
        </div>
      )}
      <div className="tb-actions">
        {actions}
        <div className="tb-icon-btn" title="Notifications" style={{ position: 'relative' }}>
          <svg style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div className="notif-dot" />
        </div>
        <div className="tb-user">
          <div className="tb-av">{user.name?.charAt(0) || 'A'}</div>
          <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)' }}>{user.name || 'Super Admin'}</span>
        </div>
      </div>
    </div>
  )
}
