export default function Modal({ open, onClose, title, children, size = '' }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size}`}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
