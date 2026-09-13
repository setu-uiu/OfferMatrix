import { useState, useCallback } from 'react'

let _setToasts = null

export function showToast(msg, type = 'default') {
  if (_setToasts) {
    const id = Date.now()
    _setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => {
      _setToasts(prev => prev.filter(t => t.id !== id))
    }, 2800)
  }
}

export default function Toast() {
  const [toasts, setToasts] = useState([])
  _setToasts = setToasts

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
