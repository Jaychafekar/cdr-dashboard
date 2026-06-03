import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'

export default function CallLogsTable({ data }) {
  const [page, setPage] = useState(1)
  const perPage = 10
  const totalPages = Math.ceil(data.length / perPage)
  const rows = data.slice((page - 1) * perPage, page * perPage)

  const exportCSV = () => {
    const headers = ['Caller Name', 'Caller Number', 'Receiver Number', 'City', 'Direction', 'Status', 'Duration', 'Cost', 'Start Time']
    const rows = data.map(r => [
      r.callerName,
      r.callerNumber,
      r.receiverNumber,
      r.city,
      r.callDirection ? 'Inbound' : 'Outbound',
      r.callStatus ? 'Success' : 'Failed',
      `${r.callDuration}s`,
      `$${parseFloat(r.callCost).toFixed(2)}`,
      new Date(r.callStartTime).toLocaleString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cdr-records.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Call Logs</CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{data.length} records</span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller Name</TableHead>
                <TableHead>Caller #</TableHead>
                <TableHead>Receiver #</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Start Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.callerName}</TableCell>
                  <TableCell>{r.callerNumber}</TableCell>
                  <TableCell>{r.receiverNumber}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell>
                    <Badge variant={r.callDirection ? 'default' : 'secondary'}>
                      {r.callDirection ? 'Inbound' : 'Outbound'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.callStatus ? 'default' : 'destructive'}>
                      {r.callStatus ? 'Success' : 'Failed'}
                    </Badge>
                  </TableCell>
                  <TableCell>{r.callDuration}s</TableCell>
                  <TableCell>${parseFloat(r.callCost).toFixed(2)}</TableCell>
                  <TableCell className="text-sm">{new Date(r.callStartTime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-muted transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-muted transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}