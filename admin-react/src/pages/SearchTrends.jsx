import { useState } from 'react'
import './SearchTrends.css'

const TRENDS = [
  { rank:1, keyword:'Samsung Galaxy A55', volume:18420, change:+42.3, category:'Electronics', searches:['s24','galaxy a55 price','a55 daraz'] },
  { rank:2, keyword:'Daraz 11.11 sale', volume:14800, change:+280.1, category:'Events', searches:['daraz sale 2026','11.11 deals'] },
  { rank:3, keyword:'Chicken pizza near me', volume:12640, change:+18.5, category:'Food', searches:['pizza dhanmondi','pizza hut bd'] },
  { rank:4, keyword:'Korean skincare BD', volume:9820, change:+31.4, category:'Skincare', searches:['korean skincare shajgoj','cerave bd'] },
  { rank:5, keyword:'Anker power bank price', volume:8400, change:-5.2, category:'Electronics', searches:['anker 737','startech power bank'] },
  { rank:6, keyword:'Free delivery Chaldal', volume:7240, change:+12.8, category:'Grocery', searches:['chaldal promo','chaldal code'] },
  { rank:7, keyword:'Pathao food promo', volume:6800, change:+22.1, category:'Food', searches:['pathao discount','pathaonew'] },
  { rank:8, keyword:'Ryans gaming laptop', volume:5640, change:+8.9, category:'Electronics', searches:['asus rog bd','lenovo legion price'] },
  { rank:9, keyword:'Shajgoj coupon', volume:4920, change:-2.1, category:'Skincare', searches:['shajgoj30','shajgoj sale'] },
  { rank:10, keyword:'Rokomari book sale', volume:3840, change:+5.4, category:'Books', searches:['rokomari discount','bangla novel price'] },
]

const CATS = ['All','Electronics','Food','Skincare','Grocery','Books','Events']

export default function SearchTrends() {
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = TRENDS.filter(t =>
    (cat==='All'||t.category===cat) &&
    t.keyword.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[{l:'Total Searches (Sep)',v:'284,920',c:'var(--blue)'},{l:'Unique Keywords',v:'18,420',c:'var(--pink)'},{l:'Trending Up',v:TRENDS.filter(t=>t.change>0).length,c:'var(--green)'},{l:'Trending Down',v:TRENDS.filter(t=>t.change<0).length,c:'var(--red)'}].map(s=>(
          <div key={s.l} className="card" style={{textAlign:'center',padding:'1.1rem'}}>
            <div style={{fontSize:'1.3rem',fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:'.63rem',color:'var(--text2)',fontWeight:600,textTransform:'uppercase',marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div style={{display:'flex',gap:'.5rem',alignItems:'center',flexWrap:'wrap'}}>
        {CATS.map(c=>(
          <button key={c} className={`ftab ${cat===c?'on':''}`} onClick={()=>setCat(c)}>{c}</button>
        ))}
        <input className="input-sm" style={{marginLeft:'auto'}} placeholder="Search keywords…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* TABLE */}
      <div className="card" style={{padding:0}}>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Keyword</th><th>Category</th><th>Volume</th><th>Change</th><th>Related Searches</th></tr>
          </thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.rank}>
                <td style={{fontWeight:900,color:t.rank<=3?'var(--amber)':'var(--text3)',fontSize:'1rem'}}>{t.rank}</td>
                <td style={{fontWeight:700,color:'var(--text)'}}>{t.keyword}</td>
                <td><span className="status-pill pill-blue" style={{fontSize:'.58rem'}}>{t.category}</span></td>
                <td style={{fontWeight:700}}>{t.volume.toLocaleString()}</td>
                <td>
                  <span style={{fontWeight:800,color:t.change>0?'var(--green)':'var(--red)',display:'flex',alignItems:'center',gap:'.2rem'}}>
                    {t.change>0?'↑':'↓'} {Math.abs(t.change).toFixed(1)}%
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'.3rem',flexWrap:'wrap'}}>
                    {t.searches.map(s=>(
                      <span key={s} style={{fontSize:'.62rem',background:'rgba(255,255,255,.05)',color:'var(--text2)',padding:'2px 6px',borderRadius:4}}>{s}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
