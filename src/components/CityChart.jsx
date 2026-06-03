import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316','#ec4899']

export default function CityChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calls by City</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="calls"
              nameKey="city"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ city, percent }) => `${city} ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v, name) => [v, name]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}