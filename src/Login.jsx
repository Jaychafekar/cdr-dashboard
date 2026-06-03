import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Phone, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const USERS = {
    'admin@pinevox.com':   { password: 'admin123',   user: { name: 'Admin User',   role: 'admin',   email: 'admin@pinevox.com'   } },
    'analyst@pinevox.com': { password: 'analyst123', user: { name: 'Analyst User', role: 'analyst', email: 'analyst@pinevox.com' } },
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const record = USERS[email.trim().toLowerCase()]
    if (record && record.password === password) {
      login(record.user, 'demo-token')
      navigate('/')
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', top: '8%', left: '18%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', bottom: '12%', right: '14%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#2563eb', display: 'grid', placeItems: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}>
            <Phone style={{ width: 22, height: 22, color: '#ffffff' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 5 }}>PineVox</h1>
          <p style={{ fontSize: 13.5, color: '#64748b' }}>CDR Analytics Platform</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '32px 28px', boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Sign in</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 26 }}>Access your dashboard</p>

          {error && (
            <div style={{ marginBottom: 18, padding: '10px 14px', borderRadius: 9, background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 7 }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@pinevox.com"
                style={{ width: '100%', padding: '10px 13px', borderRadius: 8, fontSize: 14, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 40px 10px 13px', borderRadius: 8, fontSize: 14, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  {showPw ? <EyeOff style={{ width: 15, height: 15, color: '#94a3b8' }} /> : <Eye style={{ width: 15, height: 15, color: '#94a3b8' }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: '11px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', border: 'none',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.25)',
            }}>
              {loading && <span style={{ width: 14, height: 14, border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px', borderRadius: 9, background: '#eff6ff', border: '1px solid #dbeafe', fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
            <strong style={{ color: '#2563eb' }}>Demo credentials</strong><br />
            admin@pinevox.com / admin123<br />
            analyst@pinevox.com / analyst123
          </div>
        </div>
      </div>
    </div>
  )
}