import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const LABELS_30 = Array.from({length:30},(_,i)=>`Aug ${i+1}`)
const LABELS_7  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const LABELS_3M = ['Jul','Aug','Sep']

function randArr(len, base, variance) {
  return Array.from({length:len},()=>Math.round(base + (Math.random()-0.5)*variance))
}

export default function PlatformAnalytics() {
  const [period, setPeriod] = useState('7d')
  const dauRef = useRef(null)
  const convRef = useRef(null)
  const catRef = useRef(null)
  const dauChart = useRef(null)
  const convChart = useRef(null)
  const catChart = useRef(null)

  const labels = period==='7d'?LABELS_7:period==='30d'?LABELS_30:LABELS_3M

  useEffect(()=>{
    if(dauChart.current) dauChart.current.destroy()
    if(convChart.current) convChart.current.destroy()
    if(catChart.current) catChart.current.destroy()

    const n = labels.length

    dauChart.current = new Chart(dauRef.current.getContext('2d'),{
      type:'line',
      data:{labels,datasets:[
        {label:'Active Users',data:randArr(n,8000,3000),borderColor:'#ff2a6d',backgroundColor:'rgba(255,42,109,.1)',tension:.4,fill:true,pointBackgroundColor:'#ff2a6d'},
        {label:'New Signups',data:randArr(n,340,200),borderColor:'#38bdf8',backgroundColor:'rgba(56,189,248,.08)',tension:.4,fill:true,pointBackgroundColor:'#38bdf8'},
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#94a3b8',font:{family:'Inter'}}}},scales:{x:{ticks:{color:'#475569'},grid:{color:'rgba(255,255,255,.05)'}},y:{ticks:{color:'#475569'},grid:{color:'rgba(255,255,255,.05)'}}}}
    })
    convChart.current = new Chart(convRef.current.getContext('2d'),{
      type:'bar',
      data:{labels,datasets:[
        {label:'Deal Impressions',data:randArr(n,42000,15000),backgroundColor:'rgba(56,189,248,.5)',borderColor:'#38bdf8',borderWidth:1},
        {label:'Click-throughs',data:randArr(n,8400,3000),backgroundColor:'rgba(255,42,109,.5)',borderColor:'#ff2a6d',borderWidth:1},
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#94a3b8',font:{family:'Inter'}}}},scales:{x:{ticks:{color:'#475569'},grid:{color:'rgba(255,255,255,.05)'}},y:{ticks:{color:'#475569'},grid:{color:'rgba(255,255,255,.05)'}}}}
    })
    catChart.current = new Chart(catRef.current.getContext('2d'),{
      type:'doughnut',
      data:{labels:['Electronics','Food','Skincare','Grocery','Books','Fashion'],datasets:[{data:[35,25,18,12,6,4],backgroundColor:['#38bdf8','#f59e0b','#ec4899','#10b981','#a78bfa','#ff2a6d'],borderWidth:0}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#94a3b8',font:{family:'Inter'}}}}}
    })
    return ()=>{dauChart.current?.destroy();convChart.current?.destroy();catChart.current?.destroy()}
  },[period])

  return (
    <>
      {/* PERIOD TABS */}
      <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
        {[['7d','7 Days'],['30d','30 Days'],['3m','3 Months']].map(([k,l])=>(
          <button key={k} className={`ftab ${period===k?'on':''}`} onClick={()=>setPeriod(k)}>{l}</button>
        ))}
      </div>

      {/* KPI CARDS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          {label:'Total Sessions',val:'284,920',change:'+14.2%',color:'var(--blue)'},
          {label:'Deal Impressions',val:'1.24M',change:'+22.8%',color:'var(--pink)'},
          {label:'Click-through Rate',val:'19.8%',change:'+3.1%',color:'var(--green)'},
          {label:'Avg Session',val:'4m 32s',change:'+0.8m',color:'var(--amber)'},
        ].map(k=>(
          <div key={k.label} className="card">
            <div style={{fontSize:'1.5rem',fontWeight:900,color:k.color,letterSpacing:'-1px'}}>{k.val}</div>
            <div style={{fontSize:'.7rem',fontWeight:600,color:'var(--text2)',textTransform:'uppercase',margin:'.3rem 0 .2rem'}}>{k.label}</div>
            <div style={{fontSize:'.65rem',color:'var(--green)',fontWeight:700}}>↑ {k.change} vs previous</div>
          </div>
        ))}
      </div>

      {/* DAU CHART */}
      <div className="card">
        <div className="card-head"><div className="card-title">Daily Active Users & Signups</div></div>
        <div style={{height:240}}><canvas ref={dauRef}/></div>
      </div>

      {/* IMPRESSION + CATEGORY */}
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'1.2rem'}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Deal Impressions vs Click-throughs</div></div>
          <div style={{height:220}}><canvas ref={convRef}/></div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Category Distribution</div></div>
          <div style={{height:220}}><canvas ref={catRef}/></div>
        </div>
      </div>

      {/* TOP PAGES TABLE */}
      <div className="card">
        <div className="card-head"><div className="card-title">Top Performing Pages</div></div>
        <table className="data-table">
          <thead><tr><th>Page</th><th>Sessions</th><th>Bounce Rate</th><th>Avg Duration</th><th>Conversions</th></tr></thead>
          <tbody>
            {[
              ['/deals/electronics','84,210','28.4%','6m 12s','12.4%'],
              ['/deals/food','62,840','34.1%','4m 55s','18.2%'],
              ['/search?q=daraz','48,120','52.6%','2m 34s','8.7%'],
              ['/deals/skincare','31,540','29.8%','5m 08s','14.9%'],
              ['/alerts/price','28,980','22.1%','7m 40s','31.2%'],
            ].map(([page,...rest])=>(
              <tr key={page}>
                <td style={{fontFamily:'monospace',fontSize:'.75rem',color:'var(--blue)'}}>{page}</td>
                {rest.map((v,i)=><td key={i} style={{color:'var(--text)'}}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
