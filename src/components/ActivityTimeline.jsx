import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ActivityTimeline({ perHour, perDay }) {
  const [view, setView] = useState('hour')
  const data = view === 'hour' ? perHour : perDay
  const xKey = view === 'hour' ? 'hour' : 'day'

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px 22px 14px', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Call Activity Timeline</h3>
          <p style={{ fontSize: 12, color: '#64748b' }}>Call volume · all directions</p>
        </div>
        <div style={{ display: 'flex', gap: 3, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          {[['hour', 'Per Hour'], ['day', 'Per Day']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
              background: view === v ? '#ffffff' : 'transparent',
              color:      view === v ? '#2563eb' : '#64748b',
              boxShadow:  view === v ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2563eb" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }} dy={8}
              interval={view === 'hour' ? 3 : 'preserveStartEnd'}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            />
            <Area type="monotone" dataKey="calls" name="Calls"
              stroke="#2563eb" strokeWidth={2.5}
              fill="url(#blueGrad)" dot={false}
              activeDot={{ r: 5, fill: '#2563eb', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}