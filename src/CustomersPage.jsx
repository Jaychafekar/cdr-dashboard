import { useMemo, useState } from 'react'
import { useCallData } from './hooks/useCallData'
import Sidebar from './components/Sidebar'
import { Search, Users } from 'lucide-react'
import { isCallCompleted } from './utils/analytics'

export default function CustomersPage() {
  const { data, loading } = useCallData()
  const [search, setSearch] = useState('')

  const customers = useMemo(() => {
    const map = {}
    data.forEach(r => {
      if (!map[r.callerNumber]) {
        map[r.callerNumber] = {
          name: r.callerName,
          number: r.callerNumber,
          city: r.city,
          totalCalls: 0,
          totalSpend: 0,
          completed: 0,
          failed: 0,
          lastCall: r.callStartTime,
        }
      }
      const c = map[r.callerNumber]
      c.totalCalls += 1
      c.totalSpend += parseFloat(r.callCost || 0)
      if (isCallCompleted(r)) c.completed += 1
      else c.failed += 1
      if (new Date(r.callStartTime) > new Date(c.lastCall)) c.lastCall = r.callStartTime
    })
    return Object.values(map)
      .filter(c => !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.number.includes(search) ||
        c.city.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.totalCalls - a.totalCalls)
  }, [data, search])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Customers" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Customers</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <Users style={{ width: 14, height: 14, color: '#2563eb' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>{customers.length} unique callers</span>
          </div>
        </header>

        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ position: 'relative', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94a3b8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, number or city…"
              style={{ width: '100%', paddingLeft: 38, paddingRight: 14, height: 38, borderRadius: 8, background: '#ffffff', border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading…</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Caller Name', 'Number', 'City', 'Total Calls', 'Total Spend', 'Success Rate', 'Last Call'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, i) => {
                      const successRate = c.totalCalls ? ((c.completed / c.totalCalls) * 100).toFixed(0) : 0
                      return (
                        <tr key={i}
                          style={{ borderBottom: '1px solid #f1f5f9', transition: 'background .12s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{c.name}</td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{c.number}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.city}</td>
                          <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>{c.totalCalls}</td>
                          <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>${c.totalSpend.toFixed(2)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#e2e8f0', maxWidth: 80 }}>
                                <div style={{ height: '100%', borderRadius: 999, background: successRate >= 80 ? '#10b981' : successRate >= 50 ? '#f59e0b' : '#ef4444', width: `${successRate}%` }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{successRate}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>{new Date(c.lastCall).toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
