import { useState } from 'react'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import './AlertManager.css'

const initAlerts = [
  { id:1, title:'Chaldal Scraper Down', desc:'HTTP 503 on 3 consecutive attempts. Auto-retry failed.', type:'critical', source:'Scraper Engine', time:'12 min ago', status:'open' },
  { id:2, title:'Shajgoj Rate Limited', desc:'429 Too Many Requests — throttling applied.', type:'warning', source:'Scraper Engine', time:'28 min ago', status:'open' },
  { id:3, title:'Affiliate Latency High', desc:'Affiliate API response time exceeds 300ms threshold.', type:'warning', source:'API Monitor', time:'1h ago', status:'open' },
  { id:4, title:'Price Alert Batch Sent', desc:'4 user price alerts dispatched via SMS gateway.', type:'info', source:'Alert Cron', time:'2h ago', status:'resolved' },
  { id:5, title:'DB Backup Completed', desc:'2.4 GB backup stored to S3 successfully.', type:'info', source:'Cron Scheduler', time:'3h ago', status:'resolved' },
  { id:6, title:'Click Injection Spike', desc:'TechShop BD flagged for 25.7% click injection rate.', type:'critical', source:'Fraud Engine', time:'5h ago', status:'investigating' },
]

const ALERT_RULES = [
  { name:'Scraper Down Alert', metric:'Success Rate < 10%', enabled:true },
  { name:'Rate Limit Warning', metric:'HTTP 429 > 5 times/hr', enabled:true },
  { name:'API Latency Alert', metric:'Response > 300ms', enabled:true },
  { name:'Revenue Drop Alert', metric:'Daily rev < ৳10,000', enabled:false },
  { name:'High Fraud Rate', metric:'Flag rate > 15%', enabled:true },
  { name:'New Signup Spike', metric:'Signups > 500/hr', enabled:false },
]

export default function AlertManager() {
  const [alerts, setAlerts] = useState(initAlerts)
  const [rules, setRules] = useState(ALERT_RULES)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newAlert, setNewAlert] = useState({ title:'', desc:'', type:'info', source:'' })
  const [viewAlert, setViewAlert] = useState(null)

  const filtered = alerts.filter(a =>
    (filter==='all'||a.type===filter||a.status===filter) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  )

  const critical = alerts.filter(a=>a.type==='critical'&&a.status!=='resolved').length
  const warnings  = alerts.filter(a=>a.type==='warning'&&a.status!=='resolved').length
  const resolved  = alerts.filter(a=>a.status==='resolved').length

  function resolve(id) {
    setAlerts(a=>a.map(x=>x.id===id?{...x,status:'resolved'}:x))
    setViewAlert(null)
    showToast('Alert resolved','green')
  }
  function deleteAlert(id) {
    setAlerts(a=>a.filter(x=>x.id!==id))
    showToast('Alert dismissed','amber')
  }
  function createAlert() {
    const id = Date.now()
    setAlerts(a=>[{...newAlert,id,time:'just now',status:'open'},...a])
    setShowCreate(false)
    setNewAlert({title:'',desc:'',type:'info',source:''})
    showToast('Alert created','green')
  }
  function toggleRule(i) {
    setRules(r=>r.map((x,j)=>j===i?{...x,enabled:!x.enabled}:x))
    showToast('Alert rule updated','green')
  }

  const typeBadge = {critical:'type-critical',warning:'type-warning',info:'type-info',resolved:'type-resolved'}
  const typeLabel = {critical:'CRITICAL',warning:'WARNING',info:'INFO',resolved:'RESOLVED'}

  return (
    <>
      {/* KPI */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[{l:'Critical Alerts',v:critical,c:'var(--red)'},{l:'Warnings',v:warnings,c:'var(--amber)'},{l:'Resolved Today',v:resolved,c:'var(--green)'},{l:'Active Rules',v:rules.filter(r=>r.enabled).length,c:'var(--blue)'}].map(k=>(
          <div key={k.l} className="card" style={{padding:'1.1rem',textAlign:'center'}}>
            <div style={{fontSize:'1.55rem',fontWeight:900,color:k.c,letterSpacing:'-1px'}}>{k.v}</div>
            <div style={{fontSize:'.7rem',fontWeight:600,color:'var(--text2)',textTransform:'uppercase',marginTop:2}}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* FILTER + SEARCH + CREATE */}
      <div style={{display:'flex',gap:'.5rem',alignItems:'center',flexWrap:'wrap'}}>
        {[['all','All'],['critical','Critical'],['warning','Warning'],['info','Info'],['resolved','Resolved']].map(([k,l])=>(
          <button key={k} className={`ftab ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',gap:'.5rem'}}>
          <input className="input-sm" placeholder="Search alerts…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <button className="btn-primary" onClick={()=>setShowCreate(true)}>+ Create Alert</button>
        </div>
      </div>

      {/* ALERTS TABLE */}
      <div className="card" style={{padding:0}}>
        <table className="data-table">
          <thead><tr><th>Type</th><th>Alert</th><th>Source</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(a=>(
              <tr key={a.id}>
                <td>
                  <span className={`alert-type-badge ${typeBadge[a.type]||'type-info'}`}>
                    {typeLabel[a.type]||a.type.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-desc">{a.desc}</div>
                </td>
                <td><span className="alert-source">{a.source}</span></td>
                <td style={{color:'var(--text3)',fontSize:'.78rem'}}>{a.time}</td>
                <td>
                  <span className={`status-pill ${a.status==='resolved'?'pill-green':a.status==='investigating'?'pill-yellow':'pill-red'}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'.3rem'}}>
                    <button className="act-btn act-view" onClick={()=>setViewAlert(a)}>View</button>
                    {a.status!=='resolved'&&<button className="act-btn act-edit" onClick={()=>resolve(a.id)}>Resolve</button>}
                    <button className="act-btn act-ban" onClick={()=>deleteAlert(a.id)}>Dismiss</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ALERT RULES */}
      <div className="card">
        <div className="card-head"><div className="card-title">Alert Rules</div></div>
        <div className="rules-grid">
          {rules.map((r,i)=>(
            <div key={r.name} className="rule-card">
              <div className="rule-head">
                <div><div className="rule-name">{r.name}</div><div className="rule-metric">{r.metric}</div></div>
                <label className="toggle-wrap">
                  <input type="checkbox" checked={r.enabled} onChange={()=>toggleRule(i)}/>
                  <span className="toggle-slider"/>
                </label>
              </div>
              <div>
                <span className={`status-pill ${r.enabled?'pill-green':'pill-red'}`}>{r.enabled?'Active':'Disabled'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW MODAL */}
      <Modal open={!!viewAlert} onClose={()=>setViewAlert(null)} title="Alert Details">
        {viewAlert&&(
          <>
            <div className="field"><div className="field-label">Title</div><div style={{fontWeight:700,color:'var(--text)'}}>{viewAlert.title}</div></div>
            <div className="field"><div className="field-label">Description</div><div style={{color:'var(--text2)'}}>{viewAlert.desc}</div></div>
            <div className="field"><div className="field-label">Source</div><div>{viewAlert.source}</div></div>
            <div className="field"><div className="field-label">Time</div><div>{viewAlert.time}</div></div>
            <div className="modal-actions">
              {viewAlert.status!=='resolved'&&<button className="btn-modal-save" style={{background:'var(--green)'}} onClick={()=>resolve(viewAlert.id)}>Mark Resolved</button>}
              <button className="btn-modal-cancel" onClick={()=>setViewAlert(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>

      {/* CREATE MODAL */}
      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Create Alert">
        <div className="field"><label className="field-label">Title</label><input className="field-input" value={newAlert.title} onChange={e=>setNewAlert(n=>({...n,title:e.target.value}))} placeholder="Alert title…"/></div>
        <div className="field"><label className="field-label">Description</label><textarea className="field-input" rows={3} value={newAlert.desc} onChange={e=>setNewAlert(n=>({...n,desc:e.target.value}))} placeholder="Alert description…" style={{resize:'none'}}/></div>
        <div className="form-grid">
          <div className="field">
            <label className="field-label">Type</label>
            <select className="field-input" value={newAlert.type} onChange={e=>setNewAlert(n=>({...n,type:e.target.value}))}>
              {['critical','warning','info'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field"><label className="field-label">Source</label><input className="field-input" value={newAlert.source} onChange={e=>setNewAlert(n=>({...n,source:e.target.value}))} placeholder="e.g. Scraper Engine"/></div>
        </div>
        <div className="modal-actions">
          <button className="btn-modal-save" onClick={createAlert}>Create Alert</button>
          <button className="btn-modal-cancel" onClick={()=>setShowCreate(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  )
}
