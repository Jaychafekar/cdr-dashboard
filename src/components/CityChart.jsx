import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#1d4ed8','#818cf8']

export default function CityChart({ data }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px 20px 18px', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Calls by City</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Top originating regions</p>
      <div style={{ height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="calls" nameKey="city" cx="50%" cy="50%"
              innerRadius={52} outerRadius={82} paddingAngle={3} stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={(v, n) => [v.toLocaleString(), n]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {data.slice(0, 6).map((d, i) => (
          <li key={d.city} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ flex: 1, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.city}</span>
            <span style={{ color: '#0f172a', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.calls.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}