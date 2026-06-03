import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function KPICards({ kpis }) {
  const metrics = [
    { title: 'Total Calls', value: kpis.total, icon: Phone, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Cost', value: `$${kpis.totalCost.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Avg Duration', value: `${kpis.avgDuration.toFixed(1)}s`, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Successful', value: kpis.successful, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Failed', value: kpis.failed, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon
        return (
          <Card key={m.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
              <div className={`p-2 rounded-full ${m.bg}`}>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}