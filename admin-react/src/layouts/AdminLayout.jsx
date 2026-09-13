import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Toast from '../components/Toast'
import './AdminLayout.css'

export default function AdminLayout() {
  return (
    <div className="admin-layout admin-grid-bg">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="page">
          <Outlet />
        </div>
      </div>
      <Toast />
    </div>
  )
}
