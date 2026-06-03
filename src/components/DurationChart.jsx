import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DurationChart({ stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Duration Analytics</CardTitle>
        <div className="flex gap-6 text-sm text-muted-foreground mt-1">
          <span>Longest: <strong className="text-foreground">{stats.longest}s</strong></span>
          <span>Shortest: <strong className="text-foreground">{stats.shortest}s</strong></span>
          <span>Average: <strong className="text-foreground">{stats.average.toFixed(1)}s</strong></span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.byName} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis unit="s" />
            <Tooltip formatter={(v) => [`${v}s`, 'Duration']} />
            <Bar dataKey="duration" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}