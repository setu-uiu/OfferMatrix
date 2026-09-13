import { useState } from 'react'
import { showToast } from '../components/Toast'
import './Settings.css'

const TABS = [
  { key:'general', label:'General', icon:'⚙️' },
  { key:'security', label:'Security', icon:'🔒' },
  { key:'notifications', label:'Notifications', icon:'🔔' },
  { key:'api', label:'API Keys', icon:'🔑' },
  { key:'maintenance', label:'Maintenance', icon:'🔧' },
]

export default function Settings() {
  const [tab, setTab] = useState('general')
  const [general, setGeneral] = useState({ siteName:'OfferMatrix', siteUrl:'https://offermatrix.bd', email:'admin@offermatrix.bd', timezone:'Asia/Dhaka', currency:'BDT', language:'en' })
  const [security, setSecurity] = useState({ twoFactor:true, sessionTimeout:60, maxLoginAttempts:5, ipWhitelist:'', auditLog:true })
  const [notifs, setNotifs] = useState({ emailAlerts:true, smsAlerts:false, scraperDown:true, newFraud:true, dealPending:true, lowRevenue:false })
  const [apiKeys, setApiKeys] = useState([
    { name:'Production API', key:'om_prod_••••••••••••ab2f', created:'Jan 2025', status:'active' },
    { name:'Scraper Bot', key:'om_scraper_••••••••••••cd8e', created:'Mar 2025', status:'active' },
    { name:'Analytics', key:'om_analytics_••••••••••••ef12', created:'Jun 2025', status:'active' },
  ])
  const [maint, setMaint] = useState({ maintenanceMode:false, debugMode:false, cacheEnabled:true, scraperEnabled:true, maxScrapeRate:100, backupSchedule:'daily' })

  function save() { showToast('Settings saved successfully!','green') }

  return (
    <div className="settings-layout">
      {/* LEFT TABS */}
      <div className="settings-tabs-col">
        <div className="stab-list">
          {TABS.map(t=>(
            <div key={t.key} className={`stab ${tab===t.key?'active':''}`} onClick={()=>setTab(t.key)}>
              <span className="stab-icon">{t.icon}</span>{t.label}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="settings-content">

        {tab==='general'&&(
          <div className="card">
            <div className="card-title" style={{marginBottom:'1.2rem'}}>⚙️ General Settings</div>
            <div className="settings-form-grid">
              {[['Site Name','siteName'],['Site URL','siteUrl'],['Admin Email','email'],['Timezone','timezone'],['Currency','currency'],['Language','language']].map(([l,k])=>(
                <div key={k} className="field">
                  <label className="field-label">{l}</label>
                  <input className="field-input" value={general[k]} onChange={e=>setGeneral(g=>({...g,[k]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:'1rem'}} onClick={save}>Save Changes</button>
          </div>
        )}

        {tab==='security'&&(
          <div className="card">
            <div className="card-title" style={{marginBottom:'1.2rem'}}>🔒 Security Settings</div>
            <div className="settings-form-grid">
              <div className="field">
                <label className="field-label">Session Timeout (min)</label>
                <input className="field-input" type="number" value={security.sessionTimeout} onChange={e=>setSecurity(s=>({...s,sessionTimeout:parseInt(e.target.value)}))}/>
              </div>
              <div className="field">
                <label className="field-label">Max Login Attempts</label>
                <input className="field-input" type="number" value={security.maxLoginAttempts} onChange={e=>setSecurity(s=>({...s,maxLoginAttempts:parseInt(e.target.value)}))}/>
              </div>
              <div className="field" style={{gridColumn:'1/-1'}}>
                <label className="field-label">IP Whitelist</label>
                <input className="field-input" value={security.ipWhitelist} onChange={e=>setSecurity(s=>({...s,ipWhitelist:e.target.value}))} placeholder="e.g. 192.168.1.1, 10.0.0.0/24"/>
              </div>
            </div>
            <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'.8rem'}}>
              {[['Two-Factor Auth','twoFactor'],['Audit Log','auditLog']].map(([l,k])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.8rem',background:'rgba(255,255,255,.02)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                  <div>
                    <div style={{fontWeight:700,color:'var(--text)',fontSize:'.85rem'}}>{l}</div>
                  </div>
                  <label className="toggle-wrap">
                    <input type="checkbox" checked={security[k]} onChange={()=>setSecurity(s=>({...s,[k]:!s[k]}))}/>
                    <span className="toggle-slider"/>
                  </label>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:'1rem'}} onClick={save}>Save Security Settings</button>
          </div>
        )}

        {tab==='notifications'&&(
          <div className="card">
            <div className="card-title" style={{marginBottom:'1.2rem'}}>🔔 Notification Preferences</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
              {[
                ['Email Alerts','emailAlerts','Send alerts via email'],
                ['SMS Alerts','smsAlerts','Send critical alerts via SMS'],
                ['Scraper Down','scraperDown','Notify when a scraper goes offline'],
                ['Fraud Detected','newFraud','Alert on new fraud detection'],
                ['Deal Pending','dealPending','Notify when queue exceeds 5 deals'],
                ['Revenue Drop','lowRevenue','Alert when daily revenue drops below threshold'],
              ].map(([l,k,desc])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.8rem',background:'rgba(255,255,255,.02)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                  <div>
                    <div style={{fontWeight:700,color:'var(--text)',fontSize:'.85rem'}}>{l}</div>
                    <div style={{fontSize:'.72rem',color:'var(--text3)',marginTop:2}}>{desc}</div>
                  </div>
                  <label className="toggle-wrap">
                    <input type="checkbox" checked={notifs[k]} onChange={()=>setNotifs(n=>({...n,[k]:!n[k]}))}/>
                    <span className="toggle-slider"/>
                  </label>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:'1rem'}} onClick={save}>Save Notification Settings</button>
          </div>
        )}

        {tab==='api'&&(
          <div className="card">
            <div className="card-head"><div className="card-title">🔑 API Keys</div><button className="btn-primary" onClick={()=>showToast('API key generated!','green')}>+ Generate Key</button></div>
            <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
              {apiKeys.map(k=>(
                <div key={k.name} style={{padding:'1rem',background:'rgba(255,255,255,.02)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,color:'var(--text)',marginBottom:'.3rem'}}>{k.name}</div>
                    <code style={{fontSize:'.78rem',color:'var(--text2)',background:'rgba(0,0,0,.3)',padding:'4px 8px',borderRadius:6,display:'inline-block'}}>{k.key}</code>
                    <div style={{fontSize:'.65rem',color:'var(--text3)',marginTop:'.3rem'}}>Created {k.created}</div>
                  </div>
                  <span className="status-pill pill-green">{k.status}</span>
                  <button className="act-btn act-ban" onClick={()=>showToast('API key revoked','red')}>Revoke</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='maintenance'&&(
          <div className="card">
            <div className="card-title" style={{marginBottom:'1.2rem'}}>🔧 Maintenance Settings</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.8rem',marginBottom:'1.2rem'}}>
              {[
                ['Maintenance Mode','maintenanceMode','Take site offline for maintenance'],
                ['Debug Mode','debugMode','Enable verbose error logging'],
                ['Cache Enabled','cacheEnabled','Enable Redis response caching'],
                ['Scrapers Enabled','scraperEnabled','Allow scraper crons to run'],
              ].map(([l,k,desc])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.8rem',background:maint[k]&&k==='maintenanceMode'?'rgba(239,68,68,.08)':'rgba(255,255,255,.02)',borderRadius:'var(--radius-sm)',border:`1px solid ${maint[k]&&k==='maintenanceMode'?'rgba(239,68,68,.3)':'var(--border)'}`}}>
                  <div>
                    <div style={{fontWeight:700,color:maint[k]&&k==='maintenanceMode'?'var(--red)':'var(--text)',fontSize:'.85rem'}}>{l}</div>
                    <div style={{fontSize:'.72rem',color:'var(--text3)',marginTop:2}}>{desc}</div>
                  </div>
                  <label className="toggle-wrap">
                    <input type="checkbox" checked={maint[k]} onChange={()=>setMaint(m=>({...m,[k]:!m[k]}))}/>
                    <span className="toggle-slider"/>
                  </label>
                </div>
              ))}
            </div>
            <div className="settings-form-grid">
              <div className="field">
                <label className="field-label">Max Scrape Rate (req/min)</label>
                <input className="field-input" type="number" value={maint.maxScrapeRate} onChange={e=>setMaint(m=>({...m,maxScrapeRate:parseInt(e.target.value)}))}/>
              </div>
              <div className="field">
                <label className="field-label">Backup Schedule</label>
                <select className="field-input" value={maint.backupSchedule} onChange={e=>setMaint(m=>({...m,backupSchedule:e.target.value}))}>
                  {['hourly','daily','weekly'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:'.8rem',marginTop:'1rem'}}>
              <button className="btn-primary" onClick={save}>Save Settings</button>
              <button className="btn-danger" onClick={()=>showToast('Cache cleared successfully!','green')}>Clear Cache</button>
              <button className="btn-secondary" onClick={()=>showToast('Backup triggered!','green')}>Run Backup Now</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
