import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#1d4ed8','#818cf8']

export default function DurationChart({ stats }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px 22px 14px', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Top Callers by Duration</h3>
          <p style={{ fontSize: 12, color: '#64748b' }}>Longest active callers</p>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <span style={{ color: '#64748b' }}>Avg <strong style={{ color: '#0f172a' }}>{stats.average.toFixed(0)}s</strong></span>
          <span style={{ color: '#64748b' }}>Max <strong style={{ color: '#0f172a' }}>{stats.longest}s</strong></span>
        </div>
      </div>
      <div style={{ height: 252 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.byName} layout="vertical" margin={{ top: 4, right: 8, left: 64, bottom: 4 }} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" axisLine={false} tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }} unit="s" />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }} width={62} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={v => [`${v}s`, 'Duration']}
            />
            <Bar dataKey="duration" radius={[0, 4, 4, 0]}>
              {stats.byName.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}