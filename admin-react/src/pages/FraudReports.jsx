import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { showToast } from '../components/Toast'
import Modal from '../components/Modal'
import './FraudReports.css'

Chart.register(...registerables)

const FRAUD_REPORTS = [
  { id:1, type:'click_injection', partner:'TechShop BD', severity:'critical', clicks:4820, flagged:1240, rate:25.7, time:'2h ago', status:'open' },
  { id:2, type:'cookie_stuffing', partner:'FashionHub', severity:'high', clicks:2100, flagged:380, rate:18.1, time:'5h ago', status:'open' },
  { id:3, type:'fake_conversion', partner:'GadgetZone', severity:'medium', clicks:890, flagged:67, rate:7.5, time:'1d ago', status:'investigating' },
  { id:4, type:'click_spamming', partner:'BookCorner', severity:'low', clicks:340, flagged:12, rate:3.5, time:'2d ago', status:'resolved' },
]

const LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const CHART_DATA = {
  clicks: [18200,19400,17800,21200,23400,20100,18900],
  flagged:[1200,1800,980,2400,3100,1900,1400],
}

export default function FraudReports() {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [reports, setReports] = useState(FRAUD_REPORTS)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: LABELS,
        datasets: [
          { label:'Total Clicks', data:CHART_DATA.clicks, borderColor:'#38bdf8', backgroundColor:'rgba(56,189,248,.1)', tension:.4, fill:true, pointBackgroundColor:'#38bdf8' },
          { label:'Flagged Clicks', data:CHART_DATA.flagged, borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,.1)', tension:.4, fill:true, pointBackgroundColor:'#ef4444' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color:'#94a3b8', font:{family:'Inter'} } } },
        scales: {
          x: { ticks:{color:'#475569'}, grid:{color:'rgba(255,255,255,.05)'} },
          y: { ticks:{color:'#475569'}, grid:{color:'rgba(255,255,255,.05)'} }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [])

  function updateStatus(id, status) {
    setReports(r => r.map(x => x.id===id ? {...x, status} : x))
    showToast(status==='resolved'?'Report resolved!':'Status updated','green')
    setSelectedReport(null)
  }

  const totalFlagged = reports.reduce((s,r)=>s+r.flagged,0)
  const critical = reports.filter(r=>r.severity==='critical').length

  return (
    <>
      {/* KPI CARDS */}
      <div className="fraud-kpis">
        {[
          {label:'Flagged This Week',val:totalFlagged.toLocaleString(),color:'var(--red)',sub:'↑ 12% vs last week'},
          {label:'Click Injection Attempts',val:'4,820',color:'var(--amber)',sub:'TechShop BD — highest'},
          {label:'Cookie Stuffing Events',val:'2,100',color:'var(--purple)',sub:'FashionHub flagged'},
          {label:'Critical Reports',val:critical,color:'var(--red)',sub:`${reports.filter(r=>r.status==='open').length} open cases`},
        ].map(k=>(
          <div key={k.label} className="card">
            <div style={{fontSize:'1.6rem',fontWeight:900,color:k.color,letterSpacing:'-1px'}}>{k.val}</div>
            <div style={{fontSize:'.7rem',fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'.4px',margin:'.3rem 0 .2rem'}}>{k.label}</div>
            <div style={{fontSize:'.65rem',color:'var(--text3)'}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Threat Telemetry — Last 7 Days</div>
          <span className="status-pill pill-red">Live Monitor</span>
        </div>
        <div style={{height:240}}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* REPORTS TABLE */}
      <div className="card" style={{padding:0}}>
        <div style={{padding:'1.4rem'}}>
          <div className="card-title">Fraud Reports</div>
        </div>
        <table className="data-table">
          <thead><tr><th>Partner</th><th>Type</th><th>Severity</th><th>Clicks</th><th>Flagged</th><th>Flag Rate</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {reports.map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:700}}>{r.partner}</td>
                <td style={{fontFamily:'monospace',fontSize:'.75rem',color:'var(--text2)'}}>{r.type.replace(/_/g,' ')}</td>
                <td>
                  <span className={`status-pill ${r.severity==='critical'?'pill-red':r.severity==='high'?'pill-yellow':r.severity==='medium'?'pill-blue':'pill-green'}`}>
                    {r.severity.toUpperCase()}
                  </span>
                </td>
                <td>{r.clicks.toLocaleString()}</td>
                <td style={{color:'var(--red)',fontWeight:700}}>{r.flagged.toLocaleString()}</td>
                <td style={{color:r.rate>15?'var(--red)':r.rate>5?'var(--amber)':'var(--green)',fontWeight:700}}>{r.rate}%</td>
                <td style={{color:'var(--text3)'}}>{r.time}</td>
                <td>
                  <span className={`status-pill ${r.status==='resolved'?'pill-green':r.status==='investigating'?'pill-yellow':'pill-red'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'.3rem'}}>
                    <button className="act-btn act-view" onClick={()=>setSelectedReport(r)}>Investigate</button>
                    {r.status!=='resolved' && (
                      <button className="act-btn act-ban" onClick={()=>updateStatus(r.id,'resolved')}>Resolve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!selectedReport} onClose={()=>setSelectedReport(null)} title="Fraud Report Investigation">
        {selectedReport && (
          <>
            <div className="field"><div className="field-label">Partner</div><div style={{fontWeight:700,color:'var(--text)'}}>{selectedReport.partner}</div></div>
            <div className="field"><div className="field-label">Fraud Type</div><div style={{color:'var(--red)',fontWeight:700}}>{selectedReport.type}</div></div>
            <div className="field"><div className="field-label">Flagged Clicks</div><div style={{fontWeight:700}}>{selectedReport.flagged} / {selectedReport.clicks} ({selectedReport.rate}%)</div></div>
            <div className="field"><div className="field-label">Severity</div><div>{selectedReport.severity.toUpperCase()}</div></div>
            <div className="modal-actions">
              <button className="btn-modal-save" style={{background:'var(--red)'}} onClick={()=>updateStatus(selectedReport.id,'resolved')}>Resolve Report</button>
              <button className="btn-modal-cancel" onClick={()=>setSelectedReport(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
