import { useMemo, useState } from 'react'
import { useCallData } from './hooks/useCallData'
import Sidebar from './components/Sidebar'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { isCallCompleted } from './utils/analytics'

const statusStyle = completed =>
  completed
    ? { background: '#d1fae5', color: '#065f46', label: 'Completed' }
    : { background: '#ffe4e6', color: '#9f1239', label: 'Failed' }

const dirStyle = d =>
  (d === true || d === 'true')
    ? { background: '#dbeafe', color: '#1e40af', label: 'Inbound' }
    : { background: '#eef2ff', color: '#3730a3', label: 'Outbound' }

export default function CallLogsPage() {
  const { data, loading } = useCallData()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('callStartTime')
  const [sortDir, setSortDir] = useState('desc')
  const perPage = 15

  const filtered = useMemo(() => {
    return data.filter(r =>
      !search ||
      r.callerName.toLowerCase().includes(search.toLowerCase()) ||
      r.callerNumber.includes(search) ||
      r.receiverNumber.includes(search) ||
      r.city.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (sortBy === 'callCost') { aVal = parseFloat(aVal); bVal = parseFloat(bVal) }
      if (sortBy === 'callStartTime') { aVal = new Date(aVal); bVal = new Date(bVal) }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const rows = sorted.slice((page - 1) * perPage, page * perPage)

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
    setPage(1)
  }

  const exportCSV = () => {
    const headers = ['Caller Name','Caller #','Receiver #','City','Direction','Status','Duration','Cost','Start Time']
    const csvRows = sorted.map(r => [
      r.callerName, r.callerNumber, r.receiverNumber, r.city,
      (r.callDirection === true || r.callDirection === 'true') ? 'Inbound' : 'Outbound',
      isCallCompleted(r) ? 'Completed' : 'Failed',
      `${r.callDuration}s`, `$${parseFloat(r.callCost).toFixed(2)}`,
      new Date(r.callStartTime).toLocaleString(),
    ])
    const csv = [headers, ...csvRows].map(r => r.join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'cdr-call-logs.csv',
    })
    a.click()
  }

  const TH = ({ children, col }) => {
    const active = sortBy === col
    return (
      <th
        onClick={() => col && handleSort(col)}
        style={{
          padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: active ? '#2563eb' : '#64748b',
          whiteSpace: 'nowrap', cursor: col ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        {children} {active ? (sortDir === 'asc' ? '↑' : '↓') : ''}
      </th>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Call Logs" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Call Logs</h1>
          </div>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <Download style={{ width: 14, height: 14 }} />
            Export CSV
          </button>
        </header>

        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94a3b8' }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by name, number or city…"
                style={{ width: '100%', paddingLeft: 38, paddingRight: 14, height: 38, borderRadius: 8, background: '#ffffff', border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              <strong style={{ color: '#0f172a' }}>{sorted.length}</strong> records
            </span>
          </div>

          {/* Table */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading…</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <TH col="callerName">Caller Name</TH>
                      <TH>Caller #</TH>
                      <TH>Receiver #</TH>
                      <TH col="city">City</TH>
                      <TH>Direction</TH>
                      <TH>Status</TH>
                      <TH col="callDuration">Duration</TH>
                      <TH col="callCost">Cost</TH>
                      <TH col="callStartTime">Start Time</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => {
                      const st = statusStyle(isCallCompleted(r))
                      const dt = dirStyle(r.callDirection)
                      return (
                        <tr key={r.id}
                          style={{ borderBottom: '1px solid #f1f5f9', transition: 'background .12s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{r.callerName}</td>
                          <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>{r.callerNumber}</td>
                          <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>{r.receiverNumber}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.city}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ ...dt, padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{dt.label}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ ...st, padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{st.label}</span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{r.callDuration}s</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>${parseFloat(r.callCost).toFixed(2)}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(r.callStartTime).toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                Page <strong style={{ color: '#0f172a' }}>{page}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages}</strong>
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { icon: ChevronLeft, disabled: page === 1, onClick: () => setPage(p => Math.max(1, p - 1)) },
                  { icon: ChevronRight, disabled: page === totalPages, onClick: () => setPage(p => Math.min(totalPages, p + 1)) },
                ].map(({ icon: Icon, disabled, onClick }, idx) => (
                  <button key={idx} onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 7, display: 'grid', placeItems: 'center', background: '#ffffff', border: '1px solid #e2e8f0', color: disabled ? '#cbd5e1' : '#64748b', cursor: disabled ? 'not-allowed' : 'pointer' }}>
                    <Icon style={{ width: 14, height: 14 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}