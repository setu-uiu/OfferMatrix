import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const NAV = [
  {
    section: 'Control Center',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
      { path: '/scraper-health', label: 'Scraper Health', icon: <svg viewBox="0 0 24 24"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg> },
      { path: '/deal-queue', label: 'Deal Queue', icon: <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
      { path: '/complaints', label: 'Complaints', icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, badge: null, badgeType: 'red' },
      { path: '/affiliates', label: 'Affiliate Manager', icon: <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { path: '/fraud-reports', label: 'Spam & Fraud Center', icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
    ]
  },
  {
    section: 'Analytics & Offers',
    items: [
      { path: '/offer-matrix', label: 'Offer Matrix', icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg> },
      { path: '/analytics', label: 'Platform Analytics', icon: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17l-5-5-4 4-4-4"/></svg> },
      { path: '/search-trends', label: 'Search Trends', icon: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg> },
      { path: '/alerts', label: 'Alert Manager', icon: <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    ]
  },
  {
    section: 'System',
    items: [
      { path: '/users', label: 'User Management', icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { path: '/settings', label: 'Settings', icon: <svg viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> },
    ]
  }
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleSignOut() {
    localStorage.removeItem('om_admin_token')
    localStorage.removeItem('om_admin_user')
    navigate('/login')
  }

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('om_admin_user') || '{}') } catch { return {} }
  })()

  return (
    <aside className="sb">
      <div className="sb-brand">
        <div className="sb-logo-icon">%</div>
        <div className="sb-brand-text">
          <div className="sb-logo-name">OfferMatrix</div>
          <div className="sb-admin-badge">ADMIN PANEL</div>
        </div>
      </div>
      <nav className="sb-nav">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sb-section">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 'sb-link' + (isActive ? ' active' : '')}
              >
                <span className="sb-icon">{item.icon}</span>
                {item.label}
                {item.badge != null && (
                  <span className={`sb-count${item.badgeType === 'warn' ? ' sb-count-warn' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
        <button className="sb-link sb-link-signout" onClick={handleSignOut} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', marginTop: '.5rem' }}>
          <span className="sb-icon">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          Sign Out
        </button>
      </nav>
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-user-av">{user.name?.charAt(0) || 'A'}</div>
          <div>
            <div className="sb-user-name">{user.name || 'Super Admin'}</div>
            <div className="sb-user-role">Full Access · Online</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
