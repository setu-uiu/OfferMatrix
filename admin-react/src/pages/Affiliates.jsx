import { useState } from 'react'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import './Affiliates.css'

const initAffiliates = [
  { id:1, name:'Daraz', short:'DZ', color:'#ff6900', category:'E-Commerce', comm:5.5, clicks:18420, revenue:184200, status:'active', tier:'Gold', cookieDays:30, joinDate:'Jan 2025' },
  { id:2, name:'Shajgoj', short:'SJ', color:'#ec4899', category:'Skincare', comm:8.0, clicks:5640, revenue:44200, status:'active', tier:'Silver', cookieDays:15, joinDate:'Mar 2025' },
  { id:3, name:'Pickaboo', short:'PB', color:'#e31837', category:'Electronics', comm:4.0, clicks:9840, revenue:32100, status:'active', tier:'Silver', cookieDays:30, joinDate:'Apr 2025' },
  { id:4, name:'Rokomari', short:'RK', color:'#16a34a', category:'Books', comm:6.0, clicks:3180, revenue:14200, status:'active', tier:'Bronze', cookieDays:7, joinDate:'Jun 2025' },
  { id:5, name:'Chaldal', short:'CH', color:'#0d9488', category:'Grocery', comm:4.5, clicks:2840, revenue:11200, status:'pending', tier:'Bronze', cookieDays:7, joinDate:'Aug 2025' },
  { id:6, name:'Ryans Computers', short:'RC', color:'#1d4ed8', category:'Electronics', comm:3.5, clicks:1920, revenue:8400, status:'active', tier:'Bronze', cookieDays:14, joinDate:'Sep 2025' },
  { id:7, name:'Bata BD', short:'BT', color:'#b91c1c', category:'Fashion', comm:7.0, clicks:1240, revenue:5800, status:'paused', tier:'Bronze', cookieDays:7, joinDate:'Oct 2025' },
  { id:8, name:'Pathao Food', short:'PF', color:'#7c3aed', category:'Food', comm:5.0, clicks:4200, revenue:18600, status:'active', tier:'Silver', cookieDays:1, joinDate:'Dec 2025' },
]

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState(initAffiliates)
  const [editAff, setEditAff] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newAff, setNewAff] = useState({ name:'', category:'', comm:5.0, cookieDays:30, tier:'Bronze' })

  const totalRevenue = affiliates.reduce((s,a)=>s+a.revenue,0)
  const activeCount = affiliates.filter(a=>a.status==='active').length
  const totalClicks = affiliates.reduce((s,a)=>s+a.clicks,0)

  function toggleStatus(id) {
    setAffiliates(a => a.map(x => x.id===id ? {...x, status:x.status==='active'?'paused':x.status==='paused'?'active':'active'} : x))
    showToast('Affiliate status updated','green')
  }
  function saveEdit() {
    setAffiliates(a => a.map(x => x.id===editAff.id ? editAff : x))
    setEditAff(null)
    showToast('Affiliate updated successfully','green')
  }
  function addAffiliate() {
    const id = Date.now()
    setAffiliates(a => [...a, {...newAff, id, short:newAff.name.slice(0,2).toUpperCase(), color:'#6366f1', status:'pending', clicks:0, revenue:0, joinDate:'Sep 2026'}])
    setShowAdd(false)
    setNewAff({ name:'', category:'', comm:5.0, cookieDays:30, tier:'Bronze' })
    showToast('Affiliate partner added!','green')
  }

  return (
    <>
      {/* STATS */}
      <div className="aff-stats">
        {[{label:'Total Revenue (Sep)',val:'৳'+totalRevenue.toLocaleString(),color:'var(--green)'},{label:'Active Partners',val:activeCount,color:'var(--blue)'},{label:'Total Clicks',val:totalClicks.toLocaleString(),color:'var(--pink)'},{label:'Avg Commission',val:(affiliates.reduce((s,a)=>s+a.comm,0)/affiliates.length).toFixed(1)+'%',color:'var(--amber)'}].map(s=>(
          <div key={s.label} className="card" style={{textAlign:'center',padding:'1.1rem'}}>
            <div style={{fontSize:'1.3rem',fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:'.63rem',color:'var(--text2)',fontWeight:600,textTransform:'uppercase',marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="card" style={{padding:0}}>
        <div style={{padding:'1.4rem 1.4rem .8rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div className="card-title">Affiliate Partners</div>
          <button className="btn-primary" onClick={()=>setShowAdd(true)}>+ Add Partner</button>
        </div>
        <div style={{overflowX:'auto',padding:'0 1.4rem 1.4rem'}}>
          <table className="data-table">
            <thead><tr><th colSpan="2">Partner</th><th>Category</th><th>Tier</th><th>Commission</th><th>Clicks</th><th>Revenue</th><th>Cookie</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {affiliates.map(a=>(
                <tr key={a.id}>
                  <td><div className="aff-logo" style={{background:a.color,minWidth:30,minHeight:30}}>{a.short}</div></td>
                  <td><div style={{fontWeight:800,color:'var(--text)'}}>{a.name}</div><div style={{fontSize:'.68rem',color:'var(--text3)'}}>{a.joinDate}</div></td>
                  <td style={{color:'var(--text2)'}}>{a.category}</td>
                  <td>
                    <span className={`status-pill ${a.tier==='Gold'?'pill-yellow':a.tier==='Silver'?'pill-blue':'pill-green'}`}>{a.tier}</span>
                  </td>
                  <td style={{fontWeight:700,color:'var(--green)'}}>{a.comm}%</td>
                  <td>{a.clicks.toLocaleString()}</td>
                  <td style={{fontWeight:800}}>৳{a.revenue.toLocaleString()}</td>
                  <td style={{color:'var(--text2)'}}>{a.cookieDays}d</td>
                  <td>
                    <span className={`status-pill ${a.status==='active'?'pill-green':a.status==='paused'?'pill-yellow':'pill-blue'}`}>
                      {a.status.charAt(0).toUpperCase()+a.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'.3rem'}}>
                      <button className="act-btn act-edit" onClick={()=>setEditAff({...a})}>Edit</button>
                      <button className="act-btn act-ban" onClick={()=>toggleStatus(a.id)}>
                        {a.status==='active'?'Pause':a.status==='paused'?'Resume':'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal open={!!editAff} onClose={()=>setEditAff(null)} title={`Edit — ${editAff?.name}`}>
        {editAff && (
          <>
            <div className="form-grid">
              {[['Commission %','comm','number'],['Cookie Days','cookieDays','number']].map(([l,k,t])=>(
                <div key={k} className="field">
                  <label className="field-label">{l}</label>
                  <input className="field-input" type={t} value={editAff[k]} onChange={e=>setEditAff(x=>({...x,[k]:parseFloat(e.target.value)}))} />
                </div>
              ))}
              <div className="field">
                <label className="field-label">Tier</label>
                <select className="field-input" value={editAff.tier} onChange={e=>setEditAff(x=>({...x,tier:e.target.value}))}>
                  {['Bronze','Silver','Gold'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Status</label>
                <select className="field-input" value={editAff.status} onChange={e=>setEditAff(x=>({...x,status:e.target.value}))}>
                  {['active','paused','pending'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-modal-save" onClick={saveEdit}>Save Changes</button>
              <button className="btn-modal-cancel" onClick={()=>setEditAff(null)}>Cancel</button>
            </div>
          </>
        )}
      </Modal>

      {/* ADD MODAL */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Affiliate Partner">
        <div className="form-grid">
          <div className="field" style={{gridColumn:'1/-1'}}>
            <label className="field-label">Partner Name</label>
            <input className="field-input" value={newAff.name} onChange={e=>setNewAff(n=>({...n,name:e.target.value}))} placeholder="e.g. Daraz" />
          </div>
          <div className="field">
            <label className="field-label">Category</label>
            <input className="field-input" value={newAff.category} onChange={e=>setNewAff(n=>({...n,category:e.target.value}))} placeholder="e.g. Electronics" />
          </div>
          <div className="field">
            <label className="field-label">Commission %</label>
            <input className="field-input" type="number" value={newAff.comm} onChange={e=>setNewAff(n=>({...n,comm:parseFloat(e.target.value)}))} />
          </div>
          <div className="field">
            <label className="field-label">Cookie Days</label>
            <input className="field-input" type="number" value={newAff.cookieDays} onChange={e=>setNewAff(n=>({...n,cookieDays:parseInt(e.target.value)}))} />
          </div>
          <div className="field">
            <label className="field-label">Tier</label>
            <select className="field-input" value={newAff.tier} onChange={e=>setNewAff(n=>({...n,tier:e.target.value}))}>
              {['Bronze','Silver','Gold'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-modal-save" onClick={addAffiliate}>Add Partner</button>
          <button className="btn-modal-cancel" onClick={()=>setShowAdd(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  )
}
