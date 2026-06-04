import { useMemo } from 'react'
import { useCallData } from './hooks/useCallData'
import { useAuth } from './AuthContext'
import Sidebar from './components/Sidebar'
import { isCallCompleted } from './utils/analytics'
import { Shield, AlertTriangle, Clock, PhoneOff, TrendingUp, Lock } from 'lucide-react'

export default function SecurityPage() {
  const { data, loading } = useCallData()
  const { user } = useAuth()

  const analysis = useMemo(() => {
    const highCost = data
      .filter(r => parseFloat(r.callCost) > 800)
      .sort((a, b) => parseFloat(b.callCost) - parseFloat(a.callCost))

    const shortFailed = data
      .filter(r => r.callDuration < 10 && !isCallCompleted(r))
      .sort((a, b) => a.callDuration - b.callDuration)

    const afterHours = data.filter(r => {
      const hour = new Date(r.callStartTime).getHours()
      return hour < 8 || hour >= 20
    })

    const callerFreq = {}
    data.forEach(r => {
      callerFreq[r.callerNumber] = (callerFreq[r.callerNumber] || 0) + 1
    })
    const highFreq = Object.entries(callerFreq)
      .filter(([, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
      .map(([number, count]) => {
        const record = data.find(r => r.callerNumber === number)
        return { number, count, name: record?.callerName, city: record?.city }
      })

    const riskScore = Math.min(100, (highCost.length * 10) + (shortFailed.length * 5) + (afterHours.length * 2))
    return { highCost, shortFailed, afterHours, highFreq, riskScore }
  }, [data])

  const riskColor = analysis.riskScore >= 70 ? '#ef4444' : analysis.riskScore >= 40 ? '#f59e0b' : '#10b981'
  const riskLabel = analysis.riskScore >= 70 ? 'High Risk' : analysis.riskScore >= 40 ? 'Medium Risk' : 'Low Risk'

  // Analyst restriction
  if (user?.role === 'analyst') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
        <Sidebar activePage="Security" />
        <main style={{ flex: 1, marginLeft: 256, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f1f5f9', display: 'grid', placeItems: 'center' }}>
            <Lock style={{ width: 24, height: 24, color: '#94a3b8' }} />
          </div>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#475569' }}>Access Restricted</p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Security features are available to Admin users only.</p>
          <a href="#/" style={{ marginTop: 8, padding: '8px 20px', borderRadius: 8, background: '#2563eb', color: '#ffffff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Back to Dashboard
          </a>
        </main>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Security" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Security</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8, background: riskColor + '15', border: `1px solid ${riskColor}40` }}>
            <Shield style={{ width: 14, height: 14, color: riskColor }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: riskColor }}>{riskLabel} — Score: {analysis.riskScore}/100</span>
          </div>
        </header>

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#64748b' }}>Loading…</p>
          </div>
        ) : (
          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'High Cost Calls', value: analysis.highCost.length, icon: TrendingUp, color: '#ef4444', bg: '#fff1f2', desc: 'Over $800' },
                { label: 'Suspicious Short Calls', value: analysis.shortFailed.length, icon: PhoneOff, color: '#f59e0b', bg: '#fffbeb', desc: 'Under 10s & failed' },
                { label: 'After Hours Calls', value: analysis.afterHours.length, icon: Clock, color: '#8b5cf6', bg: '#f5f3ff', desc: 'Before 8AM or after 8PM' },
                { label: 'Repeat Callers', value: analysis.highFreq.length, icon: AlertTriangle, color: '#2563eb', bg: '#eff6ff', desc: 'Called more than once' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{m.label}</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: m.bg, display: 'grid', placeItems: 'center' }}>
                      <m.icon style={{ width: 15, height: 15, color: m.color }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
                  <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>{m.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#fff1f2', display: 'grid', placeItems: 'center' }}>
                  <TrendingUp style={{ width: 13, height: 13, color: '#ef4444' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>High Cost Calls</h3>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Calls exceeding $800 — potential billing anomalies</p>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Caller Name', 'Number', 'City', 'Duration', 'Cost', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysis.highCost.slice(0, 8).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{r.callerName}</td>
                      <td style={{ padding: '10px 16px', color: '#475569' }}>{r.callerNumber}</td>
                      <td style={{ padding: '10px 16px', color: '#64748b' }}>{r.city}</td>
                      <td style={{ padding: '10px 16px', color: '#475569' }}>{r.callDuration}s</td>
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: '#ef4444' }}>${parseFloat(r.callCost).toFixed(2)}</td>
                      <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12 }}>{new Date(r.callStartTime).toLocaleString()}</td>
                    </tr>
                  ))}
                  {analysis.highCost.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: '20px 16px', textAlign: 'center', color: '#94a3b8' }}>✅ No high cost anomalies detected</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock style={{ width: 14, height: 14, color: '#8b5cf6' }} />
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>After Hours Calls</h3>
                    <p style={{ fontSize: 11.5, color: '#64748b' }}>Before 8AM or after 8PM</p>
                  </div>
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['Caller', 'City', 'Time'].map(h => (
                          <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.afterHours.slice(0, 8).map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '9px 14px', fontWeight: 600, color: '#0f172a' }}>{r.callerName}</td>
                          <td style={{ padding: '9px 14px', color: '#64748b' }}>{r.city}</td>
                          <td style={{ padding: '9px 14px', color: '#8b5cf6', fontWeight: 600 }}>{new Date(r.callStartTime).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {analysis.afterHours.length === 0 && (
                        <tr><td colSpan={3} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>✅ No after hours calls</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhoneOff style={{ width: 14, height: 14, color: '#f59e0b' }} />
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Suspicious Short Calls</h3>
                    <p style={{ fontSize: 11.5, color: '#64748b' }}>Under 10s and failed — possible spam</p>
                  </div>
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['Caller', 'Duration', 'Cost'].map(h => (
                          <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.shortFailed.slice(0, 8).map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '9px 14px', fontWeight: 600, color: '#0f172a' }}>{r.callerName}</td>
                          <td style={{ padding: '9px 14px', color: '#f59e0b', fontWeight: 600 }}>{r.callDuration}s</td>
                          <td style={{ padding: '9px 14px', color: '#475569' }}>${parseFloat(r.callCost).toFixed(2)}</td>
                        </tr>
                      ))}
                      {analysis.shortFailed.length === 0 && (
                        <tr><td colSpan={3} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>✅ No suspicious calls detected</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {analysis.highFreq.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertTriangle style={{ width: 14, height: 14, color: '#2563eb' }} />
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Repeat Callers</h3>
                    <p style={{ fontSize: 12, color: '#64748b' }}>Numbers that appear multiple times in CDR</p>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Name', 'Number', 'City', 'Call Count'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.highFreq.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{c.name}</td>
                        <td style={{ padding: '10px 16px', color: '#475569' }}>{c.number}</td>
                        <td style={{ padding: '10px 16px', color: '#64748b' }}>{c.city}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: '#dbeafe', color: '#1e40af' }}>{c.count} calls</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}