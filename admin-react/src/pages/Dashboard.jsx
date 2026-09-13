import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { useDashboardMetrics } from '../hooks/useApi.js'
import './Dashboard.css'

const METRICS_STATIC = [
  { label: 'Total Users', valueKey: 'users.total', badge: '+340', dir: 'up', iconBg: 'rgba(56,189,248,.15)', glowColor: 'rgba(56,189,248,.08)', sparkData: [60,75,70,80,85,90,88,95],
    icon: <svg viewBox="0 0 24 24" style={{width:20,height:20,strokeWidth:2,stroke:'#38bdf8',fill:'none'}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Active Merchants', valueKey: 'users.merchants', badge: '+12', dir: 'up', iconBg: 'rgba(167,139,250,.15)', glowColor: 'rgba(167,139,250,.08)', sparkData: [30,45,40,55,60,58,65,70],
    icon: <svg viewBox="0 0 24 24" style={{width:20,height:20,strokeWidth:2,stroke:'#a78bfa',fill:'none'}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Pending Deals', valueKey: 'deals.pending', badge: 'Review', dir: 'up', iconBg: 'rgba(255,42,109,.15)', glowColor: 'rgba(255,42,109,.08)', sparkData: [50,60,55,70,80,75,85,95],
    icon: <svg viewBox="0 0 24 24" style={{width:20,height:20,strokeWidth:2,stroke:'#ff2a6d',fill:'none'}}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
  { label: 'Platform Revenue', valueKey: 'revenue.totalFormatted', badge: '+18.2%', dir: 'up', iconBg: 'rgba(16,185,129,.15)', glowColor: 'rgba(16,185,129,.08)', sparkData: [40,55,50,60,65,70,75,85],
    icon: <svg viewBox="0 0 24 24" style={{width:20,height:20,strokeWidth:2,stroke:'#10b981',fill:'none'}}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label: 'Active Affiliates', valueKey: 'affiliates.active', badge: '+3', dir: 'up', iconBg: 'rgba(245,158,11,.15)', glowColor: 'rgba(245,158,11,.08)', sparkData: [10,12,11,13,14,15,16,18],
    icon: <svg viewBox="0 0 24 24" style={{width:20,height:20,strokeWidth:2,stroke:'#f59e0b',fill:'none'}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
]

function getNestedVal(obj, key) {
  if (!obj) return null
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj)
}

const initScrapers = [
  { name:'Daraz', module:'E-Commerce', rate:98, status:'live' },
  { name:'Shajgoj', module:'Skincare', rate:72, status:'warn' },
  { name:'Chaldal', module:'Grocery', rate:0, status:'err' },
  { name:'StarTech', module:'E-Commerce', rate:99, status:'live' },
  { name:'Pathao API', module:'Rides', rate:100, status:'live' },
  { name:'Ogerio', module:'Skincare', rate:81, status:'warn' },
]

const initAlerts = [
  { type:'err', text:'Chaldal scraper: HTTP 503 Service Unavailable. Auto-retry failed × 3.', time:'12 min ago' },
  { type:'warn', text:'Shajgoj: Rate limit hit (429). Throttling to 1 req/5s.', time:'28 min ago' },
  { type:'warn', text:'Ogerio: 3 product pages returned 404 Not Found.', time:'1h ago' },
  { type:'ok', text:'Price alert cron: 4 user alerts dispatched via SMS.', time:'2h ago' },
  { type:'info', text:'Database backup completed successfully (2.4 GB).', time:'3h ago' },
]

const TOP_AFFILIATES = [
  { name:'Daraz', short:'DZ', color:'#ff6900', comm:5.5, clicks:18420, revenue:184200, status:'Active' },
  { name:'Shajgoj', short:'SJ', color:'#ec4899', comm:8.0, clicks:5640, revenue:44200, status:'Active' },
  { name:'Pickaboo', short:'PB', color:'#e31837', comm:4.0, clicks:9840, revenue:32100, status:'Active' },
  { name:'Rokomari', short:'RK', color:'#16a34a', comm:6.0, clicks:3180, revenue:14200, status:'Active' },
  { name:'Chaldal', short:'CH', color:'#0d9488', comm:4.5, clicks:2840, revenue:11200, status:'Pending' },
]

const PENDING_DEALS = [
  { store:'Daraz Flash Sale', user:'Farhan H.', time:'12 min ago' },
  { store:'Pizza Place Dhanmondi', user:'Tasnim A.', time:'38 min ago' },
  { store:'StarTech In-store', user:'Rifat I.', time:'2h 14m ago' },
  { store:'Bhai Bhai Restaurant', user:'Raad A.', time:'3h ago' },
]

const SPARK_DATA = [820,950,1100,880,760,1320,1540,1820,2100,1980,2240,1650]

export default function Dashboard() {
  const navigate = useNavigate()
  const [scrapers, setScrapers] = useState(initScrapers)
  const [alerts, setAlerts] = useState(initAlerts)
  const maxSpark = Math.max(...SPARK_DATA)

  const { data: liveMetrics } = useDashboardMetrics()


  function triggerScraper() {
    setScrapers(s => s.map(x => x.status !== 'live' ? {...x, status:'live', rate:95} : x))
    showToast('Scraper triggered! All crawlers queued for immediate run.', 'green')
  }

  return (
    <>
      {/* QUICK ACTIONS */}
      <div>
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions" style={{marginTop:'.7rem'}}>
          <div className="qa-btn" onClick={triggerScraper}>
            <div className="qa-btn-icon" style={{color:'var(--blue)'}}>
              <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="2" stroke="currentColor" fill="none"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><circle cx="12" cy="12" r="2"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
            </div>
            <div className="qa-btn-label">Run Scraper Now</div>
          </div>
          <div className="qa-btn" onClick={() => navigate('/deal-queue')}>
            <div className="qa-btn-icon" style={{color:'var(--green)'}}>
              <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="2" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="qa-btn-label">Approve Queue <span style={{background:'var(--red)',color:'#fff',fontSize:'.58rem',padding:'1px 6px',borderRadius:'50px',marginLeft:2}}>8</span></div>
          </div>
          <div className="qa-btn" onClick={() => navigate('/affiliates')}>
            <div className="qa-btn-icon" style={{color:'var(--pink)'}}>
              <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="2" stroke="currentColor" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="qa-btn-label">Add Partner</div>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div>
        <div className="section-title" style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
          Platform Overview
          {liveMetrics && <span className="status-pill pill-green" style={{ fontSize:'.6rem' }}>Live</span>}
        </div>
        <div className="metrics-grid" style={{marginTop:'.7rem'}}>
          {METRICS_STATIC.map(m => {
            const liveVal = liveMetrics ? getNestedVal(liveMetrics, m.valueKey) : null
            const displayVal = liveVal !== null ? String(liveVal) : (m.value || '—')
            return (
              <div key={m.label} className="metric-card" style={{'--glow-color': m.glowColor}}>
                <div className="mc-icon" style={{background: m.iconBg}}>{m.icon}</div>
                <div className="mc-label">{m.label}</div>
                <div className="mc-value">{displayVal}</div>
                <div className={`mc-badge ${m.dir==='up'?'mc-badge-up':'mc-badge-down'}`}>
                  {m.dir==='up'?'↑':'↓'} {m.badge} this month
                </div>
                <svg className="mc-mini-chart" viewBox="0 0 80 40" preserveAspectRatio="none">
                  <polyline
                    points={m.sparkData.map((v,i) => `${i*10+5},${40-v*.3}`).join(' ')}
                    fill="none" stroke={m.dir==='up'?'#10b981':'#ef4444'} strokeWidth="2" opacity=".6"
                  />
                </svg>
              </div>
            )
          })}
        </div>
      </div>

      {/* SCRAPER + ALERTS */}

      <div className="content-grid">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Live Scraper Status</div>
            <a className="card-link" onClick={() => navigate('/scraper-health')}>View All →</a>
          </div>
          <div className="scraper-items">
            {scrapers.map(s => {
              const dotCls = {live:'dot-green',warn:'dot-yellow',err:'dot-red'}[s.status]
              const rateCls = s.rate>=90?'sc-rate-green':s.rate>=60?'sc-rate-yellow':'sc-rate-red'
              return (
                <div key={s.name} className="sc-item">
                  <div className={`dot ${dotCls}`} />
                  <div className="sc-name">{s.name}</div>
                  <div className="sc-module">{s.module}</div>
                  <div className={`sc-rate ${rateCls}`}>{s.rate}%</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Recent System Alerts</div>
            <span className="card-link" onClick={() => setAlerts([])}>Clear All</span>
          </div>
          <div className="alert-items">
            {alerts.map((a,i) => (
              <div key={i} className={`alert-item ${a.type}`}>
                <div className="ai-text">{a.text}</div>
                <div className="ai-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP AFFILIATES + DEAL QUEUE */}
      <div className="content-grid">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Top Affiliates — September</div>
            <a className="card-link" onClick={() => navigate('/affiliates')}>Manage →</a>
          </div>
          <table className="data-table">
            <thead><tr><th colSpan="2">Partner</th><th>Comm%</th><th>Clicks</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody>
              {TOP_AFFILIATES.map(a => (
                <tr key={a.name}>
                  <td><div className="aff-logo" style={{background:a.color}}>{a.short}</div></td>
                  <td><div style={{fontWeight:700}}>{a.name}</div></td>
                  <td style={{color:'var(--green)',fontWeight:700}}>{a.comm}%</td>
                  <td>{a.clicks.toLocaleString()}</td>
                  <td style={{fontWeight:800}}>৳{a.revenue.toLocaleString()}</td>
                  <td><span className={`status-pill ${a.status==='Active'?'pill-green':'pill-yellow'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Pending Deal Queue</div>
            <a className="card-link" onClick={() => navigate('/deal-queue')}>Review All →</a>
          </div>
          <div className="dq-items">
            {PENDING_DEALS.map(d => (
              <div key={d.store} className="dq-item" onClick={() => navigate('/deal-queue')}>
                <div style={{flex:1}}>
                  <div className="dq-store">{d.store}</div>
                  <div className="dq-user">by {d.user} · {d.time}</div>
                </div>
                <div style={{fontSize:'.65rem',color:'var(--amber)',fontWeight:700,background:'var(--amber-dim)',padding:'2px 7px',borderRadius:'50px',whiteSpace:'nowrap'}}>Pending</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="content-grid-3">
        <div className="card" style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
          <div className="card-title" style={{marginBottom:'.8rem'}}>Deal Approval Rate</div>
          <svg style={{transform:'rotate(-90deg)'}} width="90" height="90" viewBox="0 0 90 90">
            <circle fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6" cx="45" cy="45" r="38"/>
            <circle fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
              cx="45" cy="45" r="38" strokeDasharray="238.76" strokeDashoffset="49.7"/>
          </svg>
          <div style={{fontSize:'1.1rem',fontWeight:900,color:'var(--text)',marginTop:'.4rem'}}>79%</div>
          <div style={{fontSize:'.68rem',color:'var(--text3)'}}>142 approved / 179 total</div>
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:'.8rem'}}>Hourly Scrape Volume</div>
          <div className="sparkline">
            {SPARK_DATA.map((v,i) => (
              <div key={i} className="spark-bar" style={{
                height: Math.round((v/maxSpark)*32)+'px',
                opacity: i===SPARK_DATA.length-1?1:.35+i*.06,
                background: i===SPARK_DATA.length-1?'var(--pink)':'var(--blue)'
              }} />
            ))}
          </div>
          <div style={{fontSize:'.68rem',color:'var(--text3)',marginTop:'.5rem',textAlign:'right'}}>Last 12 hours</div>
          <div style={{marginTop:'.8rem',display:'flex',justifyContent:'space-between'}}>
            <div><div style={{fontSize:'1.1rem',fontWeight:900,color:'var(--text)'}}>24,381</div><div style={{fontSize:'.65rem',color:'var(--text3)'}}>Products Indexed</div></div>
            <div style={{textAlign:'right'}}><div style={{fontSize:'1.1rem',fontWeight:900,color:'var(--green)'}}>+2,142</div><div style={{fontSize:'.65rem',color:'var(--text3)'}}>Since yesterday</div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:'1rem'}}>Revenue Breakdown</div>
          {[{label:'Affiliate Commission',val:'৳1,84,200',w:'72%',color:'var(--pink)'},{label:'Deal Vouchers',val:'৳47,500',w:'18%',color:'var(--blue)'},{label:'Platform Ads',val:'৳25,800',w:'10%',color:'var(--amber)'}].map(r => (
            <div key={r.label}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.3rem'}}>
                <span style={{fontSize:'.78rem',color:'var(--text2)'}}>{r.label}</span>
                <span style={{fontSize:'.88rem',fontWeight:800}}>{r.val}</span>
              </div>
              <div style={{height:5,background:'rgba(255,255,255,.06)',borderRadius:50,overflow:'hidden',marginBottom:'.5rem'}}>
                <div style={{height:'100%',width:r.w,background:r.color,borderRadius:50}} />
              </div>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--border)',paddingTop:'.55rem',display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:'.82rem',fontWeight:700,color:'var(--text2)'}}>Total (Sep)</span>
            <span style={{fontSize:'1rem',fontWeight:900,color:'var(--green)'}}>৳2,57,500</span>
          </div>
        </div>
      </div>
    </>
  )
}
