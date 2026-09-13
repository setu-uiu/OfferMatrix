import { useState } from 'react'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import { usePendingDeals, useUpdateDealStatus } from '../hooks/useApi.js'
import './DealQueue.css'


const initDeals = [
  { id:1, store:'Daraz Flash Sale', desc:'Samsung Galaxy A55 listed for ৳38,000 on Daraz — massive ৳8,000 below normal RRP.', category:'Electronics', location:'Daraz.com.bd (Online)', user:'Farhan H.', trustPts:2400, time:'12 min ago', status:'pending', img:'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&q=80' },
  { id:2, store:'Pizza Place Dhanmondi', desc:'Buy 1 Get 1 Free on all large pizzas every Thursday 6–9 PM.', category:'Food', location:'Dhanmondi, Dhaka', user:'Tasnim A.', trustPts:1800, time:'38 min ago', status:'pending', img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&q=80' },
  { id:3, store:'Shajgoj Sale', desc:'Shajgoj running a secret 30% off on all Korean skincare items if you use SHAJGOJ30 at checkout.', category:'Skincare', location:'shajgoj.com (Online)', user:'Nadia S.', trustPts:950, time:'1h 20m ago', status:'pending', img:null },
  { id:4, store:'StarTech Dhaka', desc:'Anker 737 Power Bank available for ৳5,200 in-store at StarTech Elephant Road. Online price shows ৳6,100.', category:'Electronics', location:'Elephant Road, Dhaka', user:'Rifat I.', trustPts:1550, time:'2h 14m ago', status:'pending', img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=120&q=80' },
  { id:5, store:'Bhai Bhai Restaurant', desc:'Mutton Kacchi Biryani for ৳220 on Thursdays only — normal price is ৳320.', category:'Food', location:'Mirpur 1, Dhaka', user:'Raad A.', trustPts:1200, time:'3h 05m ago', status:'pending', img:null },
  { id:6, store:'Chaldal Grocery', desc:'Chaldal offering free delivery on all orders above ৳499 until end of September.', category:'Grocery', location:'chaldal.com (Online)', user:'Farhan H.', trustPts:2400, time:'4h 30m ago', status:'pending', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&q=80' },
  { id:7, store:'Ryans Computers', desc:'i7 13th Gen gaming laptops available 15% below their website price in-store only.', category:'Electronics', location:'Uttara, Dhaka', user:'Tasnim A.', trustPts:1800, time:'5h 50m ago', status:'pending', img:null },
  { id:8, store:'Pathao Food Offer', desc:"Pathao Food is giving ৳100 off on orders above ৳400 using promo PATHAONEW.", category:'Food', location:'Pathao App (Online)', user:'Nadia S.', trustPts:950, time:'6h 22m ago', status:'pending', img:'https://images.unsplash.com/photo-1567337710282-00832b415979?w=120&q=80' },
  { id:9, store:'Daraz 11.11 Teaser', desc:'Early bird discount on smartphones spotted on Daraz.', category:'Electronics', location:'Daraz.com.bd (Online)', user:'Rifat I.', trustPts:1550, time:'2 days ago', status:'approved', img:null },
  { id:10, store:'BFC Burger Deal', desc:'BFC Gulshan running BOGO on Zinger Burgers every weekend.', category:'Food', location:'Gulshan 2, Dhaka', user:'Farhan H.', trustPts:2400, time:'3 days ago', status:'approved', img:null },
  { id:11, store:'Random Deal', desc:'Get 99% off on iPhones using this link! Limited time!!!', category:'Electronics', location:'Unknown', user:'Unknown', trustPts:0, time:'1 day ago', status:'rejected', img:null, rejectReason:'Spam or promotional content' },
]

const QUICK_REASONS = [
  'Duplicate deal already exists on platform','Deal expired or no longer valid',
  'Insufficient evidence / No photo attached','Spam or promotional content',
  'Inaccurate pricing information','Policy violation'
]

export default function DealQueue() {
  const { data: liveDeals, isError: dealsError } = usePendingDeals()
  const updateStatus = useUpdateDealStatus()

  // Static deals for offline mode
  const [localDeals, setLocalDeals] = useState(initDeals)

  const isOffline = dealsError

  // If API live, merge live pending + static approved/rejected for display
  const allDeals = liveDeals
    ? [
        ...liveDeals.map(d => ({
          id: d.id,
          store: d.title,
          desc: `${d.merchant} — ${d.sector} sector`,
          category: d.sector,
          location: d.merchant,
          user: d.submittedBy?.name || 'Unknown',
          trustPts: 1000,
          time: new Date(d.createdAt).toLocaleString(),
          status: d.status.toLowerCase(),
          couponCode: d.couponCode,
          originalPrice: d.originalPrice,
          discountedPrice: d.discountedPrice,
          discountPercent: d.discountPercent,
          img: null,
        })),
        ...localDeals.filter(d => d.status !== 'pending'),
      ]
    : localDeals

  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(new Set())
  const [notes, setNotes] = useState({})
  const [previewDeal, setPreviewDeal] = useState(null)
  const [activeReason, setActiveReason] = useState('')

  const filtered = filter==='all' ? allDeals : allDeals.filter(d => d.status===filter)
  const pending  = allDeals.filter(d => d.status==='pending').length
  const approved = allDeals.filter(d => d.status==='approved').length
  const rejected = allDeals.filter(d => d.status==='rejected').length

  async function approve(id) {
    if (liveDeals && liveDeals.find(d => d.id === id)) {
      try {
        await updateStatus.mutateAsync({ id, status: 'APPROVED' })
        showToast('Deal approved and published!', 'green')
      } catch { showToast('Failed to approve deal', 'red') }
    } else {
      setLocalDeals(d => d.map(x => x.id===id ? {...x, status:'approved'} : x))
      setSelected(s => { const n=new Set(s); n.delete(id); return n })
      showToast('Deal approved! User earned +50 trust points.','green')
    }
  }
  async function reject(id) {
    const reason = notes[id] || 'Does not meet quality guidelines'
    if (liveDeals && liveDeals.find(d => d.id === id)) {
      try {
        await updateStatus.mutateAsync({ id, status: 'REJECTED' })
        showToast('Deal rejected.', 'red')
      } catch { showToast('Failed to reject deal', 'red') }
    } else {
      setLocalDeals(d => d.map(x => x.id===id ? {...x, status:'rejected', rejectReason:reason} : x))
      setSelected(s => { const n=new Set(s); n.delete(id); return n })
      showToast('Deal rejected.','red')
    }
  }
  function bulkApprove() {
    if (!selected.size) { showToast('No deals selected.','amber'); return }
    setLocalDeals(d => d.map(x => selected.has(x.id) && x.status==='pending' ? {...x, status:'approved'} : x))
    setSelected(new Set())
    showToast('Selected deals approved in bulk!','green')
  }
  function bulkReject() {
    if (!selected.size) { showToast('No deals selected.','amber'); return }
    setLocalDeals(d => d.map(x => selected.has(x.id) && x.status==='pending' ? {...x, status:'rejected', rejectReason:'Bulk rejection by admin'} : x))
    setSelected(new Set())
    showToast('Selected deals rejected in bulk.','red')

  }
  function toggleSelect(id) {
    setSelected(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n })
  }
  function setReason(r) {
    setActiveReason(r)
    const updated = {}
    filtered.forEach(d => { if(d.status==='pending') updated[d.id]=r })
    setNotes(prev => ({...prev, ...updated}))
  }

  return (
    <div className="dq-layout">
      <div className="dq-main">
        {/* STATS */}
        <div className="dq-stats">
          {[{label:'⏳ Pending',val:pending,color:'var(--amber)'},{label:'✓ Approved',val:approved,color:'var(--green)'},{label:'✗ Rejected',val:rejected,color:'var(--red)'},{label:'📅 Today',val:24,color:'var(--text)'}].map(s=>(
            <div key={s.label} className="card" style={{textAlign:'center',padding:'1rem'}}>
              <div style={{fontSize:'1.4rem',fontWeight:900,color:s.color}}>{s.val}</div>
              <div style={{fontSize:'.7rem',color:'var(--text2)',fontWeight:600,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTER + BULK */}
        <div className="dq-filter-row">
          {[['all','All Deals'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']].map(([k,l])=>(
            <button key={k} className={`ftab ${filter===k?'on':''}`} onClick={()=>setFilter(k)}>
              {l}{k==='pending'&&<span className="pending-chip">{pending}</span>}
            </button>
          ))}
          <div style={{marginLeft:'auto',display:'flex',gap:'.5rem'}}>
            <button className="btn-success" onClick={bulkApprove}>✓ Approve Selected</button>
            <button className="btn-danger" onClick={bulkReject}>✗ Reject Selected</button>
          </div>
        </div>

        {/* DEAL LIST */}
        <div className="deal-list">
          {filtered.length===0 && <div className="empty-state">No deals in this category.</div>}
          {filtered.map(d => (
            <div key={d.id} className={`deal-card ${selected.has(d.id)?'selected':''}`}>
              <div className="dc-top">
                <div className={`dc-check ${selected.has(d.id)?'checked':''}`} onClick={()=>toggleSelect(d.id)}>
                  {selected.has(d.id)&&'✓'}
                </div>
                <div className="dc-img-wrap">
                  {d.img ? <img src={d.img} alt={d.store} onError={e=>e.target.style.display='none'}/> : <div className="dc-no-img">🏷</div>}
                </div>
                <div className="dc-info">
                  <div style={{display:'flex',alignItems:'flex-start',gap:'.5rem',marginBottom:'.3rem'}}>
                    <div className="dc-store">{d.store}</div>
                    <span className={`dc-badge ${d.status==='pending'?'badge-pending':d.status==='approved'?'badge-approved':'badge-rejected'}`}>
                      {d.status==='pending'?'⏳ Pending':d.status==='approved'?'✓ Approved':'✗ Rejected'}
                    </span>
                  </div>
                  <div className="dc-desc">{d.desc}</div>
                  <div className="dc-meta-row">
                    <div className="dc-user-chip">
                      <div className="dc-user-av">{d.user.charAt(0)}</div>
                      <span>{d.user}</span>
                      <span className="dc-trust">+{d.trustPts} pts</span>
                    </div>
                    <span className="dc-cat">{d.category}</span>
                    <span className="dc-loc">📍 {d.location}</span>
                    <span className="dc-time">{d.time}</span>
                  </div>
                  {d.rejectReason && <div className="dc-reject-note">✗ Reason: {d.rejectReason}</div>}
                </div>
              </div>
              {d.status==='pending' && (
                <div className="dc-actions">
                  <input className="dc-note-input" placeholder="Rejection note (optional)…"
                    value={notes[d.id]||''}
                    onChange={e=>setNotes(n=>({...n,[d.id]:e.target.value}))}
                  />
                  <button className="dc-btn-preview" onClick={()=>setPreviewDeal(d)}>Preview</button>
                  <button className="dc-btn-reject" onClick={()=>reject(d.id)}>✗ Reject</button>
                  <button className="dc-btn-approve" onClick={()=>approve(d.id)}>✓ Approve</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SIDE PANEL */}
      <div className="dq-side">
        <div className="card">
          <div className="card-title" style={{marginBottom:'.8rem'}}>Queue Overview</div>
          {[['Avg. Review Time','14 min','var(--text)'],['Approval Rate','79.3%','var(--green)'],['Deals Today','24','var(--text)'],['Oldest Pending','2h 14m ago','var(--amber)']].map(([l,v,c])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'.82rem',marginBottom:'.4rem'}}>
              <span style={{color:'var(--text2)'}}>{l}</span><span style={{fontWeight:700,color:c}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:'1rem',background:'linear-gradient(135deg,var(--green-dim),transparent)',borderRadius:10,padding:'.8rem',textAlign:'center'}}>
            <div style={{fontSize:'1.3rem',fontWeight:900,color:'var(--green)'}}>{approved}</div>
            <div style={{fontSize:'.7rem',color:'var(--green)',fontWeight:700}}>Deals Live on Platform</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{marginBottom:'.8rem'}}>Quick Rejection Reasons</div>
          <div style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
            {QUICK_REASONS.map(r=>(
              <button key={r} className="reason-btn" onClick={()=>setReason(r)}>{r}</button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{marginBottom:'.8rem'}}>Top Contributors</div>
          {[['Farhan Hossain','48 deals','+2,400 pts','gold'],['Tasnim Akter','36 deals','+1,800 pts','silver'],['Rifat Islam','31 deals','+1,550 pts','bronze'],['Raad Ahmed','24 deals','+1,200 pts',''],['Nadia Sultana','19 deals','+950 pts','']].map(([name,deals,pts,rank],i)=>(
            <div key={name} className="lb-item">
              <div className={`lb-rank ${rank}`}>{i+1}</div>
              <div style={{flex:1}}><div style={{fontSize:'.8rem',fontWeight:700}}>{name}</div><div style={{fontSize:'.65rem',color:'var(--text3)'}}>{deals} approved</div></div>
              <div style={{fontSize:'.72rem',fontWeight:800,color:'var(--green)'}}>{pts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <Modal open={!!previewDeal} onClose={()=>setPreviewDeal(null)} title="Deal Preview">
        {previewDeal && (
          <>
            <div className="field"><div className="field-label">Store</div><div style={{color:'var(--text)',fontWeight:700}}>{previewDeal.store}</div></div>
            <div className="field"><div className="field-label">Description</div><div style={{color:'var(--text2)',fontSize:'.85rem'}}>{previewDeal.desc}</div></div>
            <div className="field"><div className="field-label">Location</div><div style={{color:'var(--text)'}}>{previewDeal.location}</div></div>
            <div className="field"><div className="field-label">Submitted By</div><div style={{color:'var(--text)'}}>{previewDeal.user} ({previewDeal.trustPts} pts)</div></div>
            <div className="field"><div className="field-label">Submitted</div><div style={{color:'var(--text)'}}>{previewDeal.time}</div></div>
            <div className="modal-actions">
              <button className="btn-modal-save" style={{background:'var(--green)'}} onClick={()=>{approve(previewDeal.id);setPreviewDeal(null)}}>✓ Approve</button>
              <button className="btn-modal-cancel" onClick={()=>setPreviewDeal(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
