import { useState } from 'react'
import { showToast } from '../components/Toast'
import { useScraperHealth, useTriggerScraper } from '../hooks/useApi.js'
import './ScraperHealth.css'


const initScrapers = [
  { id:1, name:'Daraz', url:'daraz.com.bd', module:'E-Commerce', status:'live', rate:98.2, uptime:99.7, lastRun:'2 min ago', items:12840, errors:3 },
  { id:2, name:'Shajgoj', url:'shajgoj.com', module:'Skincare', status:'warn', rate:72.4, uptime:91.2, lastRun:'15 min ago', items:3640, errors:47 },
  { id:3, name:'Chaldal', url:'chaldal.com', module:'Grocery', status:'err', rate:0, uptime:68.3, lastRun:'2h ago', items:0, errors:503 },
  { id:4, name:'StarTech', url:'startech.com.bd', module:'Electronics', status:'live', rate:99.1, uptime:99.9, lastRun:'5 min ago', items:8920, errors:1 },
  { id:5, name:'Pathao API', url:'api.pathao.com', module:'Rides', status:'live', rate:100, uptime:100, lastRun:'1 min ago', items:2200, errors:0 },
  { id:6, name:'Ogerio', url:'ogerio.com', module:'Skincare', status:'warn', rate:81.3, uptime:88.6, lastRun:'8 min ago', items:2100, errors:29 },
  { id:7, name:'Pickaboo', url:'pickaboo.com', module:'Electronics', status:'live', rate:96.4, uptime:97.8, lastRun:'3 min ago', items:5640, errors:8 },
  { id:8, name:'Rokomari', url:'rokomari.com', module:'Books', status:'live', rate:94.7, uptime:99.1, lastRun:'4 min ago', items:3820, errors:5 },
]

const API_ENDPOINTS = [
  { name:'Deals API', url:'/api/v2/deals', status:'live', latency:42, req:'18.2k/h' },
  { name:'Search API', url:'/api/v2/search', status:'live', latency:67, req:'31.4k/h' },
  { name:'Alerts API', url:'/api/v2/alerts', status:'live', latency:28, req:'3.1k/h' },
  { name:'Affiliate API', url:'/api/v2/affiliates', status:'warn', latency:342, req:'1.2k/h' },
  { name:'Auth API', url:'/api/v1/auth', status:'live', latency:55, req:'8.6k/h' },
  { name:'Scraper Webhook', url:'/webhook/scraper', status:'err', latency:0, req:'0/h' },
]

const LOG_ENTRIES = [
  { time:'23:04:12', level:'err', msg:'[Chaldal] HTTP 503: Service Unavailable. Retry 3/3 failed.' },
  { time:'23:02:58', level:'warn', msg:'[Shajgoj] Rate limit 429. Throttling to 1 req/5s for 15m.' },
  { time:'23:01:20', level:'info', msg:'[Daraz] Batch #482 complete: 320 new products indexed.' },
  { time:'23:00:05', level:'ok', msg:'[Pathao] Ride price sync successful — 2,200 entries updated.' },
  { time:'22:58:44', level:'warn', msg:'[Ogerio] 3 product pages returned 404 Not Found.' },
  { time:'22:55:30', level:'info', msg:'[StarTech] Batch #291 complete: 140 products indexed.' },
  { time:'22:52:10', level:'err', msg:'[Chaldal] HTTP 503: Service Unavailable. Retry 2/3 failed.' },
  { time:'22:48:05', level:'ok', msg:'[Pickaboo] 5,640 products indexed successfully.' },
  { time:'22:44:30', level:'info', msg:'Cron: Price alert dispatch — 4 users notified via SMS.' },
  { time:'22:40:00', level:'ok', msg:'Database backup completed: 2.4 GB (gzip). Stored to S3.' },
]

export default function ScraperHealth() {
  const { data: liveScrapers, isError } = useScraperHealth()
  const triggerMutation = useTriggerScraper()
  const [localScrapers, setLocalScrapers] = useState(initScrapers)
  const [logs, setLogs] = useState(LOG_ENTRIES)

  // Merge live data over static: prefer live if available
  const scrapers = liveScrapers ? liveScrapers.map(s => ({
    id: s.id,
    name: s.botName,
    url: s.targetUrl.replace('https://', ''),
    module: 'Scraper',
    status: s.status === 'ONLINE' ? 'live' : s.status === 'THROTTLED' ? 'warn' : 'err',
    rate: s.status === 'ONLINE' ? 98 : s.status === 'THROTTLED' ? 72 : 0,
    uptime: s.status === 'ONLINE' ? 99.5 : s.status === 'THROTTLED' ? 88.0 : 65.0,
    lastRun: new Date(s.lastRunAt).toLocaleTimeString(),
    items: s.itemsScrapedCount,
    errors: s.lastError ? 1 : 0,
    lastError: s.lastError,
    latency: s.responseLatencyMs,
  })) : localScrapers

  async function restartScraper(scraper) {
    if (liveScrapers) {
      try {
        const res = await triggerMutation.mutateAsync(scraper.name)
        addLog(`[${scraper.name}] ${res.message}`, res.data?.status === 'ONLINE' ? 'ok' : 'warn')
        showToast(res.message, res.data?.status === 'ONLINE' ? 'green' : 'amber')
      } catch {
        showToast(`Failed to trigger ${scraper.name}`, 'red')
      }
    } else {
      setLocalScrapers(s => s.map(x => x.id===scraper.id ? {...x, status:'live', rate:95, errors:0, lastRun:'just now'} : x))
      showToast(`Scraper restarted successfully!`, 'green')
    }
  }


  function addLog(msg, level='info') {
    const now = new Date()
    const t = [now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':')
    setLogs(prev => [{time:t, level, msg}, ...prev].slice(0,20))
  }

  return (
    <>
      {/* STATUS GRID */}
      <div>
        <div className="section-title">Scraper Status</div>
        <div className="scraper-grid" style={{marginTop:'.7rem'}}>
          {scrapers.map(s => {
            const dotCls = {live:'dot-green',warn:'dot-yellow',err:'dot-red'}[s.status]
            const rateCls = s.rate>=90?'green':s.rate>=60?'amber':'red'
            return (
              <div key={s.id} className={`scraper-card sc-${s.status}`}>
                <div className="sc-card-head">
                  <div className="sc-card-name">{s.name}</div>
                  <div className={`dot ${dotCls}`} />
                </div>
                <div className="sc-card-url">{s.url}</div>
                <div className="sc-card-module">{s.module}</div>
                <div className="sc-card-stats">
                  <div className="sc-stat"><div className="sc-stat-val" style={{color:`var(--${rateCls})`}}>{s.rate}%</div><div className="sc-stat-lbl">Success</div></div>
                  <div className="sc-stat"><div className="sc-stat-val">{s.uptime}%</div><div className="sc-stat-lbl">Uptime</div></div>
                  <div className="sc-stat"><div className="sc-stat-val">{s.items.toLocaleString()}</div><div className="sc-stat-lbl">Items</div></div>
                  <div className="sc-stat"><div className="sc-stat-val" style={{color:s.errors>10?'var(--red)':'var(--text)'}}>{s.errors}</div><div className="sc-stat-lbl">Errors</div></div>
                </div>
                <div className="sc-uptime-bar">
                  <div className="sc-uptime-fill" style={{width:s.uptime+'%',background:s.status==='err'?'var(--red)':s.status==='warn'?'var(--amber)':'var(--green)'}} />
                </div>
                <div className="sc-card-foot">
                  <span className="sc-last-run">Last: {s.lastRun}</span>
                  <button className="btn-restart" onClick={() => restartScraper(s)} disabled={triggerMutation.isPending}>
                    {s.status==='err'?'Restart':'Run Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* API ENDPOINTS */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">API Endpoint Status</div>
          <span className="pill-green status-pill">6 Endpoints</span>
        </div>
        <table className="data-table">
          <thead><tr><th>Endpoint</th><th>URL</th><th>Status</th><th>Latency</th><th>Req/hr</th></tr></thead>
          <tbody>
            {API_ENDPOINTS.map(ep => (
              <tr key={ep.name}>
                <td style={{fontWeight:700}}>{ep.name}</td>
                <td style={{fontFamily:'monospace',fontSize:'.75rem',color:'var(--text3)'}}>{ep.url}</td>
                <td>
                  <span className={`status-pill ${ep.status==='live'?'pill-green':ep.status==='warn'?'pill-yellow':'pill-red'}`}>
                    {ep.status==='live'?'Live':ep.status==='warn'?'Degraded':'Down'}
                  </span>
                </td>
                <td style={{color:ep.latency>200?'var(--red)':ep.latency>100?'var(--amber)':'var(--green)',fontWeight:700}}>
                  {ep.latency>0?ep.latency+'ms':'—'}
                </td>
                <td>{ep.req}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LIVE LOGS */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Live System Log</div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="btn-primary" style={{fontSize:'.72rem'}} onClick={() => addLog('[Manual] Admin triggered scraper refresh.','info')}>
              Refresh
            </button>
            <button className="btn-secondary" style={{fontSize:'.72rem'}} onClick={() => setLogs([])}>Clear</button>
          </div>
        </div>
        <div className="log-terminal">
          {logs.map((l,i) => (
            <div key={i} className={`log-line log-${l.level}`}>
              <span className="log-time">{l.time}</span>
              <span className={`log-level-badge lvl-${l.level}`}>{l.level.toUpperCase()}</span>
              <span className="log-msg">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
