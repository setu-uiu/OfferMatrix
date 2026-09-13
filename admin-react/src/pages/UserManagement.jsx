import { useState } from 'react'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import './UserManagement.css'

const initUsers = [
  { id:1,  name:'Super Admin',    email:'admin@offermatrix.bd',   handle:'@superadmin',    role:'Admin',     status:'Active',  pts:9999, deals:0,  joined:'Jan 2025', color:'#ff2a6d' },
  { id:2,  name:'Farhan Hossain', email:'farhan@gmail.com',       handle:'@farhan.h',      role:'Moderator', status:'Active',  pts:2400, deals:48, joined:'Mar 2025', color:'#a78bfa' },
  { id:3,  name:'Raad Ahmed',     email:'raad@gmail.com',         handle:'@raad.ahmed',    role:'User',      status:'Active',  pts:1200, deals:24, joined:'Jan 2026', color:'#38bdf8' },
  { id:4,  name:'Tasnim Akter',   email:'tasnim@gmail.com',       handle:'@tasnim.a',      role:'User',      status:'Active',  pts:1800, deals:36, joined:'Feb 2026', color:'#f59e0b' },
  { id:5,  name:'Rifat Islam',    email:'rifat@gmail.com',        handle:'@rifat.i',       role:'User',      status:'Active',  pts:1550, deals:31, joined:'Mar 2026', color:'#10b981' },
  { id:6,  name:'Nadia Sultana',  email:'nadia@gmail.com',        handle:'@nadia.s',       role:'User',      status:'Active',  pts:950,  deals:19, joined:'Apr 2026', color:'#ec4899' },
  { id:7,  name:'Tech World BD',  email:'techworld@merchant.bd',  handle:'@techworldbd',   role:'Merchant',  status:'Active',  pts:500,  deals:0,  joined:'May 2026', color:'#0d9488' },
  { id:8,  name:'Daraz Official', email:'daraz@partner.bd',       handle:'@darazofficial', role:'Merchant',  status:'Active',  pts:1000, deals:0,  joined:'Jan 2025', color:'#ff6900' },
  { id:9,  name:'Spam Bot 001',   email:'spam@bot.xyz',           handle:'@spambot',       role:'User',      status:'Banned',  pts:0,    deals:0,  joined:'Aug 2026', color:'#64748b' },
  { id:10, name:'Karim Sheikh',   email:'karim@gmail.com',        handle:'@karim.s',       role:'User',      status:'Active',  pts:340,  deals:8,  joined:'Jul 2026', color:'#3b82f6' },
  { id:11, name:'Asha Roy',       email:'asha@gmail.com',         handle:'@asha.r',        role:'User',      status:'Pending', pts:0,    deals:0,  joined:'Sep 2026', color:'#a855f7' },
  { id:12, name:'Rahman Stores',  email:'rahman@merchant.bd',     handle:'@rahmanstores',  role:'Merchant',  status:'Active',  pts:200,  deals:0,  joined:'Jun 2026', color:'#16a34a' },
]

const ROLES = ['User','Merchant','Moderator','Admin']
const ROLE_ICONS = { User:'👤', Merchant:'🏪', Moderator:'🛡', Admin:'⚡' }

export default function UserManagement() {
  const [users, setUsers] = useState(initUsers)
  const [filter, setFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [roleModal, setRoleModal] = useState(null)
  const [viewModal, setViewModal] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')

  const filtered = users.filter(u => {
    const matchRole = filter==='all'||filter==='Banned'||(u.role===filter)
    const matchBan  = filter!=='Banned'||(u.status==='Banned')
    const matchRoleF = roleFilter?u.role===roleFilter:true
    const matchStatus= statusFilter?u.status===statusFilter:true
    const matchSearch= u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||u.handle.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchBan && matchRoleF && matchStatus && matchSearch
  })

  function toggleBan(id) {
    const u = users.find(x=>x.id===id)
    if (u.role==='Admin') { showToast('Cannot ban an Admin account.','amber'); return }
    if (!window.confirm(`${u.status==='Banned'?'Unban':'Ban'} user "${u.name}"?`)) return
    setUsers(us=>us.map(x=>x.id===id?{...x,status:x.status==='Banned'?'Active':'Banned'}:x))
    showToast(u.status==='Banned'?`${u.name} unbanned.`:`${u.name} banned.`,u.status==='Banned'?'green':'red')
  }
  function saveRole() {
    if (!selectedRole) return
    setUsers(us=>us.map(x=>x.id===roleModal.id?{...x,role:selectedRole}:x))
    showToast(`${roleModal.name}'s role updated to ${selectedRole}.`,'green')
    setRoleModal(null)
  }

  const roleCls = {Admin:'role-admin',Moderator:'role-mod',Merchant:'role-merchant',User:'role-user'}
  const sCls = {Active:'pill-active',Banned:'pill-banned',Pending:'pill-pending'}

  return (
    <>
      {/* STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'1rem'}}>
        {[{l:'Total Users',v:'18,420',c:'var(--blue)'},{l:'Active',v:'16,240',c:'var(--green)'},{l:'Merchants',v:'142',c:'var(--amber)'},{l:'Banned',v:'38',c:'var(--red)'},{l:'Admins/Mods',v:'5',c:'var(--purple)'}].map(s=>(
          <div key={s.l} className="card" style={{textAlign:'center',padding:'1.1rem'}}>
            <div style={{fontSize:'1.3rem',fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:'.63rem',color:'var(--text2)',fontWeight:600,textTransform:'uppercase',marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FILTER ROW */}
      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',alignItems:'center'}}>
        {[['all','All Users'],['Admin','Admins'],['Moderator','Moderators'],['Merchant','Merchants'],['Banned','Banned']].map(([k,l])=>(
          <button key={k} className={`ftab ${filter===k?'on':''}`} onClick={()=>setFilter(k)}>{l}</button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',gap:'.5rem'}}>
          <input className="input-sm" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="input-sm" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {ROLES.map(r=><option key={r}>{r}</option>)}
          </select>
          <select className="input-sm" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {['Active','Banned','Pending'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card" style={{padding:0}}>
        <div style={{overflowX:'auto',padding:'0 1.4rem 1.4rem'}}>
          <table className="data-table" style={{marginTop:'1rem'}}>
            <thead><tr><th colSpan="2">User</th><th>Handle</th><th>Role</th><th>Status</th><th>Trust Points</th><th>Deals</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u=>{
                const trustPct = Math.min(100,(u.pts/2500)*100)
                return (
                  <tr key={u.id}>
                    <td><div className="user-av" style={{background:u.color}}>{u.name.charAt(0)}</div></td>
                    <td>
                      <div style={{fontWeight:800,color:'var(--text)',fontSize:'.85rem'}}>{u.name}</div>
                      <div style={{fontSize:'.68rem',color:'var(--text3)'}}>{u.email}</div>
                    </td>
                    <td style={{fontSize:'.7rem',color:'var(--text2)'}}>{u.handle}</td>
                    <td><span className={`role-badge ${roleCls[u.role]||'role-user'}`}>{u.role}</span></td>
                    <td><span className={`status-pill ${sCls[u.status]||'pill-pending'}`}>{u.status}</span></td>
                    <td>
                      <div style={{fontWeight:700,fontSize:'.8rem'}}>{u.pts.toLocaleString()}</div>
                      <div className="trust-bar-wrap"><div className="trust-bar-fill" style={{width:trustPct+'%'}}/></div>
                    </td>
                    <td style={{fontWeight:700}}>{u.deals}</td>
                    <td style={{fontSize:'.72rem',color:'var(--text3)'}}>{u.joined}</td>
                    <td>
                      <div style={{display:'flex',gap:'.3rem'}}>
                        <button className="act-btn act-view" onClick={()=>setViewModal(u)}>View</button>
                        <button className="act-btn act-role" onClick={()=>{setRoleModal(u);setSelectedRole(u.role)}}>Role</button>
                        <button className="act-btn act-ban" onClick={()=>toggleBan(u.id)}>{u.status==='Banned'?'Unban':'Ban'}</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROLE MODAL */}
      <Modal open={!!roleModal} onClose={()=>setRoleModal(null)} title={`Change Role — ${roleModal?.name}`}>
        <div className="role-options">
          {ROLES.map(r=>(
            <div key={r} className={`role-opt ${selectedRole===r?'selected':''}`} onClick={()=>setSelectedRole(r)}>
              <div className="role-opt-icon">{ROLE_ICONS[r]}</div>
              <div className="role-opt-name">{r==='User'?'Standard User':r}</div>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-modal-save" onClick={saveRole}>Save Role</button>
          <button className="btn-modal-cancel" onClick={()=>setRoleModal(null)}>Cancel</button>
        </div>
      </Modal>

      {/* VIEW MODAL */}
      <Modal open={!!viewModal} onClose={()=>setViewModal(null)} title={viewModal?.name}>
        {viewModal&&[
          ['Email',viewModal.email],['Handle',viewModal.handle],['Role',viewModal.role],['Status',viewModal.status],
          ['Trust Points',viewModal.pts.toLocaleString()],['Deals Submitted',viewModal.deals],
          ['Member Since',viewModal.joined],['User ID','#OM-'+String(viewModal.id).padStart(5,'0')]
        ].map(([l,v])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'.5rem 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontSize:'.82rem'}}>
            <span style={{color:'var(--text2)'}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
          </div>
        ))}
        {viewModal&&(
          <div className="modal-actions" style={{marginTop:'1.2rem'}}>
            <button className="btn-modal-cancel" style={{width:'100%'}} onClick={()=>setViewModal(null)}>Close</button>
          </div>
        )}
      </Modal>
    </>
  )
}
