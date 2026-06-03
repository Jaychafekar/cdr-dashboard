import { useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { isCallCompleted } from '../utils/analytics'

const statusStyle = completed =>
  completed
    ? { background: '#d1fae5', color: '#065f46', label: 'Completed' }
    : { background: '#ffe4e6', color: '#9f1239', label: 'Failed' }

const dirStyle = d =>
  (d === true || d === 'true')
    ? { background: '#dbeafe', color: '#1e40af', label: 'Inbound' }
    : { background: '#eef2ff', color: '#3730a3', label: 'Outbound' }

export default function CallLogsTable({ data }) {
  const [page, setPage] = useState(1)
  const perPage    = 10
  const totalPages = Math.max(1, Math.ceil(data.length / perPage))
  const rows       = data.slice((page - 1) * perPage, page * perPage)

  const exportCSV = () => {
    const headers = ['Caller Name','Caller #','Receiver #','City','Direction','Status','Duration','Cost','Start Time']
    const csvRows = data.map(r => [
      r.callerName, r.callerNumber, r.receiverNumber, r.city,
      (r.callDirection === true || r.callDirection === 'true') ? 'Inbound' : 'Outbound',
      isCallCompleted(r) ? 'Completed' : 'Failed',
      `${r.callDuration}s`, `$${parseFloat(r.callCost).toFixed(2)}`,
      new Date(r.callStartTime).toLocaleString(),
    ])
    const csv = [headers, ...csvRows].map(r => r.join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'cdr-records.csv',
    })
    a.click()
  }

  const TH = ({ children, align = 'left' }) => (
    <th style={{ padding: '12px 18px', textAlign: align, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', whiteSpace: 'nowrap' }}>
      {children}
    </th>
  )

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 16px', borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Recent Call Logs</h3>
          <p style={{ fontSize: 12, color: '#64748b' }}>{data.length.toLocaleString()} total records</p>
        </div>
        <button onClick={exportCSV} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
          borderRadius: 8, border: '1px solid #bfdbfe',
          background: '#eff6ff', color: '#2563eb',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>
          <Download style={{ width: 13, height: 13 }} />
          Export CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <TH>Caller Name</TH>
              <TH>Caller #</TH>
              <TH>Receiver #</TH>
              <TH>City</TH>
              <TH>Direction</TH>
              <TH>Status</TH>
              <TH align="right">Duration</TH>
              <TH align="right">Cost</TH>
              <TH>Start Time</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const st = statusStyle(isCallCompleted(r))
              const dt = dirStyle(r.callDirection)
              return (
                <tr key={r.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background .12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{r.callerName}</td>
                  <td style={{ padding: '12px 18px', color: '#475569', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{r.callerNumber}</td>
                  <td style={{ padding: '12px 18px', color: '#475569', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{r.receiverNumber}</td>
                  <td style={{ padding: '12px 18px', color: '#64748b' }}>{r.city}</td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ ...dt, padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{dt.label}</span>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ ...st, padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{r.callDuration}s</td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 600, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>${parseFloat(r.callCost).toFixed(2)}</td>
                  <td style={{ padding: '12px 18px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 12 }}>{new Date(r.callStartTime).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          Page <strong style={{ color: '#0f172a' }}>{page}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages}</strong>
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { icon: ChevronLeft,  disabled: page === 1,          onClick: () => setPage(p => Math.max(1, p - 1)) },
            { icon: ChevronRight, disabled: page === totalPages, onClick: () => setPage(p => Math.min(totalPages, p + 1)) },
          ].map(({ icon: Icon, disabled, onClick }, idx) => (
            <button key={idx} onClick={onClick} disabled={disabled} style={{
              width: 30, height: 30, borderRadius: 7, display: 'grid', placeItems: 'center',
              background: '#ffffff', border: '1px solid #e2e8f0',
              color: disabled ? '#cbd5e1' : '#64748b',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}>
              <Icon style={{ width: 14, height: 14 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}