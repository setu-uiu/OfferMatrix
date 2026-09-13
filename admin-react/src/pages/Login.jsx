import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import './Login.css'

const DEMO_OTP = '202609'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [otp, setOtp] = useState(['','','','','',''])
  const [timer, setTimer] = useState(299)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const timerRef = useRef(null)
  const otpRefs  = useRef([])

  useEffect(() => {
    if (step === 2) startTimer()
    return () => clearInterval(timerRef.current)
  }, [step])

  function startTimer() {
    clearInterval(timerRef.current)
    setTimer(299)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function fmtTime(s) {
    const m = Math.floor(s/60).toString().padStart(2,'0')
    const sec = (s%60).toString().padStart(2,'0')
    return `${m}:${sec}`
  }

  async function doStep1() {
    setError('')
    if (!email || !pass) { setError('Please fill in all fields.'); return }
    try {
      const res = await api.post('/auth/login', { email, password: pass })
      if (res.data.success) {
        // Store token and user temporarily; will persist on OTP verify
        sessionStorage.setItem('_pending_token', res.data.data.token)
        sessionStorage.setItem('_pending_user', JSON.stringify(res.data.data.user))
        setStep(2)
      } else {
        setError(res.data.error || 'Login failed.')
        setPass('')
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Unable to connect to server. Check that the API is running on port 5000.'
      setError(msg)
      setPass('')
    }
  }

  function handleOtpChange(i, val) {
    const v = val.replace(/\D/g,'').slice(-1)
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) otpRefs.current[i+1]?.focus()
  }
  function handleOtpKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i-1]?.focus()
  }

  function doVerify() {
    setError(''); setSuccess('')
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter all 6 digits.'); return }
    if (code !== DEMO_OTP) {
      setError('Invalid OTP. Use the demo code: 2 0 2 6 0 9')
      setOtp(['','','','','',''])
      otpRefs.current[0]?.focus()
      return
    }
    // Persist JWT on successful OTP
    const token = sessionStorage.getItem('_pending_token')
    const user = sessionStorage.getItem('_pending_user')
    if (token) {
      localStorage.setItem('om_admin_token', token)
      localStorage.setItem('om_admin_user', user || '{}')
      sessionStorage.removeItem('_pending_token')
      sessionStorage.removeItem('_pending_user')
    }
    clearInterval(timerRef.current)
    setSuccess('OTP verified! Redirecting to control panel…')
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  return (
    <div className="login-page">
      <div className="bg-blob blob-1" /><div className="bg-blob blob-2" /><div className="bg-blob blob-3" />
      <div className="bg-grid" />
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon">%</div>
            <div>
              <div className="logo-text">OfferMatrix</div>
              <div className="logo-sub">Admin Control Panel</div>
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="login-header">
                <div className="login-title">Administrator Login</div>
                <div className="login-sub">Access restricted to authorized personnel only</div>
              </div>
              <div className="steps">
                <div className="step step-active">1</div>
                <div className="step-line" /><div className="step step-pending">2</div>
                <div className="step-line" /><div className="step step-pending">✓</div>
              </div>
              <div className="info-bar">
                🔒 Demo: <b>admin@offermatrix.bd</b> / <b>Admin@2026</b>
              </div>
              {error && <div className="alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@offermatrix.bd" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <input className="form-input" type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••" onKeyDown={e => e.key === 'Enter' && doStep1()} />
                  <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁'}
                  </span>
                </div>
              </div>
              <div className="remember-row">
                <label className="remember-label"><input type="checkbox" /> Remember for 7 days</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <button className="btn-login" onClick={doStep1}>Continue to 2FA →</button>
              <a href="/index.html"><button className="btn-ghost">← Back to Public Site</button></a>
            </>
          )}

          {step === 2 && (
            <>
              <div className="login-header">
                <div className="login-title">Two-Factor Verification</div>
                <div className="login-sub">Enter the 6-digit code sent to {email}</div>
              </div>
              <div className="steps">
                <div className="step step-done">✓</div>
                <div className="step-line done" /><div className="step step-active">2</div>
                <div className="step-line" /><div className="step step-pending">✓</div>
              </div>
              {error && <div className="alert-error">{error}</div>}
              {success && <div className="alert-success">{success}</div>}
              <div className="otp-hint">Demo OTP: <b style={{ color: 'var(--pink)' }}>2 0 2 6 0 9</b></div>
              <div className="otp-row">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className="otp-box"
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    value={v}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>
              <div className="resend-wrap">
                Code expires in <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{fmtTime(timer)}</span> ·{' '}
                <span className="resend-link" onClick={() => { setOtp(['','','','','','']); startTimer(); otpRefs.current[0]?.focus() }}>Resend Code</span>
              </div>
              <button className="btn-login" style={{ marginTop: '1.2rem' }} onClick={doVerify}>Verify & Enter Admin Panel</button>
              <button className="btn-ghost" onClick={() => { clearInterval(timerRef.current); setStep(1); setError(''); setOtp(['','','','','','']) }}>← Back</button>
            </>
          )}

          <div className="login-footer">
            <a href="/signin.html">User Login</a> &nbsp;·&nbsp; <a href="#">Security Policy</a>
          </div>
          <div className="security-badge">🔒 256-bit SSL Encrypted &nbsp;·&nbsp; JWT Authenticated</div>
        </div>
      </div>
    </div>
  )
}
