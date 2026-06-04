import { useMemo } from 'react'
import { useCallData } from './hooks/useCallData'
import Sidebar from './components/Sidebar'
import { isCallCompleted } from './utils/analytics'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function TrunksPage() {
  const { data, loading } = useCallData()

  const stats = useMemo(() => {
    const inbound = data.filter(r => r.callDirection === true || r.callDirection === 'true')
    const outbound = data.filter(r => r.callDirection === false || r.callDirection === 'false')
    const inboundCompleted = inbound.filter(isCallCompleted).length
    const outboundCompleted = outbound.filter(isCallCompleted).length

    const hourly = {}
    data.forEach(r => {
      const hour = new Date(r.callStartTime).getHours()
      if (!hourly[hour]) hourly[hour] = { hour: `${hour}:00`, inbound: 0, outbound: 0 }
      if (r.callDirection === true || r.callDirection === 'true') hourly[hour].inbound++
      else hourly[hour].outbound++
    })

    return {
      inbound: inbound.length,
      outbound: outbound.length,
      inboundRate: inbound.length ? ((inboundCompleted / inbound.length) * 100).toFixed(1) : 0,
      outboundRate: outbound.length ? ((outboundCompleted / outbound.length) * 100).toFixed(1) : 0,
      inboundCost: inbound.reduce((s, r) => s + parseFloat(r.callCost || 0), 0),
      outboundCost: outbound.reduce((s, r) => s + parseFloat(r.callCost || 0), 0),
      hourly: Array.from({ length: 24 }, (_, h) => hourly[h] || { hour: `${h}:00`, inbound: 0, outbound: 0 }),
      pieData: [
        { name: 'Inbound', value: inbound.length },
        { name: 'Outbound', value: outbound.length },
      ]
    }
  }, [data])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Trunks" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        <header style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Trunks</h1>
        </header>

        {loading ? <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#64748b' }}>Loading…</p></div> : (
          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'Inbound Calls', value: stats.inbound, color: '#2563eb', bg: '#eff6ff' },
                { label: 'Outbound Calls', value: stats.outbound, color: '#7c3aed', bg: '#f5f3ff' },
                { label: 'Inbound Success', value: `${stats.inboundRate}%`, color: '#059669', bg: '#ecfdf5' },
                { label: 'Outbound Success', value: `${stats.outboundRate}%`, color: '#d97706', bg: '#fffbeb' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                  <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 10 }}>{m.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
              {/* Hourly Breakdown */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Inbound vs Outbound by Hour</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Call volume distribution throughout the day</p>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.hourly} margin={{ top: 4, right: 8, left: -20, bottom: 4 }} barSize={8}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="inbound" name="Inbound" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outbound" name="Outbound" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Direction Split</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Inbound vs Outbound ratio</p>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.pieData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                        <Cell fill="#2563eb" />
                        <Cell fill="#818cf8" />
                      </Pie>
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
                  {[{ label: 'Inbound', color: '#2563eb' }, { label: 'Outbound', color: '#818cf8' }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                      <span style={{ fontSize: 12, color: '#64748b' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Comparison */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Cost Comparison</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Total Inbound Cost', value: `$${stats.inboundCost.toFixed(2)}`, color: '#2563eb' },
                  { label: 'Total Outbound Cost', value: `$${stats.outboundCost.toFixed(2)}`, color: '#7c3aed' },
                  { label: 'Avg Inbound Cost', value: `$${stats.inbound ? (stats.inboundCost / stats.inbound).toFixed(2) : '0.00'}`, color: '#2563eb' },
                  { label: 'Avg Outbound Cost', value: `$${stats.outbound ? (stats.outboundCost / stats.outbound).toFixed(2) : '0.00'}`, color: '#7c3aed' },
                ].map((m, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{m.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}