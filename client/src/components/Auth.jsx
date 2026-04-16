import { useState } from 'react'

const INIT_REG = { name: '', email: '', password: '', gender: '' }
const INIT_LOG = { email: '', password: '' }

export default function Auth({ mode, setAuthModal }) {
  const [tab, setTab]     = useState(mode)           // 'login' | 'register'
  const [form, setForm]   = useState(tab === 'login' ? INIT_LOG : INIT_REG)
  const [toast, setToast] = useState(false)
  const [msg, setMsg]     = useState('')

  const switchTab = next => {
    setTab(next)
    setForm(next === 'login' ? INIT_LOG : INIT_REG)
  }

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    if (tab === 'register' && !form.gender) { alert('Please select your gender.'); return }
    setMsg(tab === 'login' ? 'Logged in successfully! ✅' : 'Account created! Welcome to SafeYatra ✅')
    setToast(true)
    setTimeout(() => { setToast(false); setAuthModal(null) }, 1800)
  }

  return (
    <div className="auth-overlay" onClick={() => setAuthModal(null)}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="auth-close" onClick={() => setAuthModal(null)}>✕</button>

        {/* Logo */}
        <div className="auth-logo">🛡️ SafeYatra</div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            Login
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
            Register
          </button>
        </div>

        <div className="auth-title">{tab === 'login' ? 'Welcome Back' : 'Create Account'}</div>
        <div className="auth-sub">{tab === 'login' ? 'Login to your SafeYatra account' : 'Join SafeYatra — stay safe while you travel'}</div>

        <form onSubmit={submit} className="auth-form">
          {tab === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handle} required />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required minLength={6} />
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handle} required>
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {tab === 'login' ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        {/* Toast inside modal */}
        {toast && (
          <div style={{
            marginTop: '14px',
            background: '#22c55e', color: 'white',
            padding: '10px 16px', borderRadius: '8px',
            fontSize: '0.87rem', fontWeight: 500,
            textAlign: 'center'
          }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}
