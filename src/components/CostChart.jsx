import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe']

export default function CostChart({ data }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px 22px 14px', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Call Cost by City</h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Total billed per location</p>
      <div style={{ height: 252 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 44 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="city" axisLine={false} tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }} angle={-35} textAnchor="end" dy={6} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={v => [`$${v.toFixed(2)}`, 'Total Cost']}
            />
            <Bar dataKey="totalCost" name="Total Cost" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}