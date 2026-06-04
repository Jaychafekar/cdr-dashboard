import { useMemo, useState } from 'react'
import { useCallData } from './hooks/useCallData'
import Sidebar from './components/Sidebar'
import { getKPIs, isCallCompleted } from './utils/analytics'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { FileText, TrendingUp, DollarSign, Phone, X, Download } from 'lucide-react'

const COLORS = ['#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#1d4ed8','#818cf8','#a78bfa','#c4b5fd','#ddd6fe']

export default function ReportsPage() {
  const { data, loading } = useCallData()
  const [showModal, setShowModal] = useState(false)

  const kpis = useMemo(() => getKPIs(data), [data])

  const topCallers = useMemo(() => {
    const map = {}
    data.forEach(r => {
      if (!map[r.callerName]) map[r.callerName] = { name: r.callerName, calls: 0 }
      map[r.callerName].calls += 1
    })
    return Object.values(map).sort((a, b) => b.calls - a.calls).slice(0, 10)
  }, [data])

  const topCostCalls = useMemo(() => {
    return [...data].sort((a, b) => parseFloat(b.callCost) - parseFloat(a.callCost)).slice(0, 10)
  }, [data])

  const busyHours = useMemo(() => {
    const map = {}
    data.forEach(r => {
      const hour = new Date(r.callStartTime).getHours()
      map[hour] = (map[hour] || 0) + 1
    })
    return Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, calls: map[h] || 0 }))
  }, [data])

  const cityBreakdown = useMemo(() => {
    const map = {}
    data.forEach(r => {
      if (!map[r.city]) map[r.city] = { city: r.city, calls: 0, cost: 0, completed: 0 }
      map[r.city].calls += 1
      map[r.city].cost += parseFloat(r.callCost || 0)
      if (isCallCompleted(r)) map[r.city].completed += 1
    })
    return Object.values(map).sort((a, b) => b.calls - a.calls)
  }, [data])

  const successRate = kpis.total ? ((kpis.successful / kpis.total) * 100).toFixed(1) : 0
  const avgMins = Math.floor(kpis.avgDuration / 60)
  const avgSecs = Math.round(kpis.avgDuration % 60)
  const peakHour = busyHours.reduce((max, h) => h.calls > max.calls ? h : max, busyHours[0] || { hour: 'N/A', calls: 0 })
  const topCity = cityBreakdown[0]

  const downloadReport = () => {
    const now = new Date().toLocaleString()
    let report = `PINEVOX CDR ANALYTICS REPORT\n`
    report += `Generated: ${now}\n`
    report += `${'='.repeat(45)}\n\n`
    report += `SUMMARY\n${'-'.repeat(20)}\n`
    report += `Total Calls:      ${kpis.total}\n`
    report += `Total Revenue:    $${kpis.totalCost.toFixed(2)}\n`
    report += `Success Rate:     ${successRate}%\n`
    report += `Failed Calls:     ${kpis.failed}\n`
    report += `Avg Duration:     ${avgMins}m ${avgSecs}s\n\n`
    report += `TOP 10 CALLERS\n${'-'.repeat(20)}\n`
    topCallers.forEach((c, i) => { report += `${i + 1}. ${c.name} - ${c.calls} call${c.calls > 1 ? 's' : ''}\n` })
    report += `\nTOP 10 MOST EXPENSIVE CALLS\n${'-'.repeat(20)}\n`
    topCostCalls.forEach((r, i) => { report += `${i + 1}. ${r.callerName} - $${parseFloat(r.callCost).toFixed(2)} (${r.callDuration}s) - ${r.city}\n` })
    report += `\nCITY BREAKDOWN\n${'-'.repeat(20)}\n`
    cityBreakdown.forEach(c => {
      const rate = c.calls ? ((c.completed / c.calls) * 100).toFixed(0) : 0
      report += `${c.city.padEnd(20)} | ${String(c.calls).padEnd(5)} | $${c.cost.toFixed(2).padEnd(10)} | ${rate}%\n`
    })
    report += `\nBUSIEST HOURS\n${'-'.repeat(20)}\n`
    report += `Peak hour: ${peakHour.hour} with ${peakHour.calls} calls\n`
    const blob = new Blob([report], { type: 'text/plain' })
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `pinevox-report-${new Date().toISOString().split('T')[0]}.txt`,
    })
    a.click()
  }

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar activePage="Reports" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading…</p>
      </main>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Reports" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Reports</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#2563eb', border: 'none', cursor: 'pointer' }}>
            <FileText style={{ width: 14, height: 14, color: '#ffffff' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Summary Report</span>
          </button>
        </header>

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(15,23,42,0.2)', overflow: 'hidden' }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'grid', placeItems: 'center' }}>
                    <FileText style={{ width: 16, height: 16, color: '#2563eb' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Summary Report</h2>
                    <p style={{ fontSize: 12, color: '#64748b' }}>Generated {new Date().toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X style={{ width: 18, height: 18, color: '#64748b' }} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* KPI Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Total Calls', value: kpis.total },
                    { label: 'Total Revenue', value: `$${kpis.totalCost.toFixed(2)}` },
                    { label: 'Success Rate', value: `${successRate}%` },
                    { label: 'Failed Calls', value: kpis.failed },
                    { label: 'Avg Duration', value: `${avgMins}m ${avgSecs}s` },
                    { label: 'Total Cities', value: cityBreakdown.length },
                  ].map((m, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                      <p style={{ fontSize: 11.5, color: '#64748b', marginBottom: 4 }}>{m.label}</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Highlights</p>
                  {[
                    { label: '🏆 Top Caller', value: topCallers[0]?.name || 'N/A' },
                    { label: '⏰ Peak Hour', value: `${peakHour.hour} (${peakHour.calls} calls)` },
                    { label: '💰 Highest Call Cost', value: `$${parseFloat(topCostCalls[0]?.callCost || 0).toFixed(2)}` },
                    { label: '🏙️ Most Active City', value: topCity?.city || 'N/A' },
                  ].map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{h.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{h.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', gap: 10, padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={downloadReport}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 9, background: '#2563eb', border: 'none', cursor: 'pointer' }}>
                  <Download style={{ width: 14, height: 14, color: '#ffffff' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Download Report</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: 9, background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Calls', value: kpis.total, icon: Phone, color: '#2563eb', bg: '#eff6ff' },
              { label: 'Total Revenue', value: `$${kpis.totalCost.toFixed(2)}`, icon: DollarSign, color: '#059669', bg: '#ecfdf5' },
              { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
              { label: 'Avg Duration', value: `${avgMins}m ${avgSecs}s`, icon: Phone, color: '#7c3aed', bg: '#f5f3ff' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{m.label}</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: m.bg, display: 'grid', placeItems: 'center' }}>
                    <m.icon style={{ width: 15, height: 15, color: m.color }} />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Top 10 Callers</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>By number of calls</p>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCallers} layout="vertical" margin={{ top: 4, right: 8, left: 70, bottom: 4 }} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={68} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="calls" radius={[0, 4, 4, 0]}>
                      {topCallers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Busiest Hours</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Call volume by hour of day</p>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={busyHours} margin={{ top: 4, right: 8, left: -20, bottom: 4 }} barSize={10}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="calls" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top 10 Most Expensive */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Top 10 Most Expensive Calls</h3>
              <p style={{ fontSize: 12, color: '#64748b' }}>Highest cost individual calls</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['#', 'Caller Name', 'City', 'Duration', 'Cost', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCostCalls.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 600 }}>#{i + 1}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{r.callerName}</td>
                    <td style={{ padding: '10px 16px', color: '#64748b' }}>{r.city}</td>
                    <td style={{ padding: '10px 16px', color: '#475569' }}>{r.callDuration}s</td>
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: '#2563eb' }}>${parseFloat(r.callCost).toFixed(2)}</td>
                    <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12 }}>{new Date(r.callStartTime).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* City Breakdown */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Cost Breakdown by City</h3>
              <p style={{ fontSize: 12, color: '#64748b' }}>All cities with call activity</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['City', 'Total Calls', 'Total Cost', 'Avg Cost', 'Success Rate'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cityBreakdown.map((c, i) => {
                  const rate = c.calls ? ((c.completed / c.calls) * 100).toFixed(0) : 0
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{c.city}</td>
                      <td style={{ padding: '10px 16px', color: '#475569' }}>{c.calls}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>${c.cost.toFixed(2)}</td>
                      <td style={{ padding: '10px 16px', color: '#475569' }}>${(c.cost / c.calls).toFixed(2)}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                          background: rate >= 80 ? '#d1fae5' : rate >= 50 ? '#fef3c7' : '#ffe4e6',
                          color: rate >= 80 ? '#065f46' : rate >= 50 ? '#92400e' : '#9f1239',
                        }}>{rate}%</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}