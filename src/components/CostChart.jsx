import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function CostChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Cost by City</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" angle={-45} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v, name) => [`$${v}`, name === 'totalCost' ? 'Total Cost' : 'Avg Cost']} />
            <Legend />
            <Bar dataKey="totalCost" name="Total Cost" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avgCost" name="Avg Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}