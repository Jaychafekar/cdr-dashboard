import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ActivityTimeline({ perHour, perDay }) {
  const [view, setView] = useState('hour')
  const data = view === 'hour' ? perHour : perDay
  const key = view === 'hour' ? 'hour' : 'day'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Call Activity Timeline</CardTitle>
        <div className="flex gap-2">
          {['hour', 'day'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Per {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={key} tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}