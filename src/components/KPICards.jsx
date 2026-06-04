import { PhoneCall, Clock, Activity, DollarSign, PhoneOff, ArrowUpRight, ArrowDownRight, Lock } from 'lucide-react'

function Card({ label, value, sub, icon: Icon, tone, delta, locked }) {
  const tones = {
    blue:    { bg: '#eff6ff', color: '#2563eb' },
    indigo:  { bg: '#eef2ff', color: '#4f46e5' },
    success: { bg: '#ecfdf5', color: '#059669' },
    warning: { bg: '#fffbeb', color: '#d97706' },
    danger:  { bg: '#fff1f2', color: '#e11d48' },
  }
  const t = tones[tone] || tones.blue
  const positive = (delta ?? 0) >= 0

  if (locked) {
    return (
      <div style={{
        background: '#f8fafc', borderRadius: 12, padding: '20px 20px 18px',
        border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 110,
      }}>
        <Lock style={{ width: 18, height: 18, color: '#cbd5e1' }} />
        <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 11, color: '#cbd5e1' }}>Admin only</p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#ffffff', borderRadius: 12, padding: '20px 20px 18px',
        border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)',
        transition: 'box-shadow .2s', cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(15,23,42,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: t.bg, display: 'grid', placeItems: 'center' }}>
          <Icon style={{ width: 16, height: 16, color: t.color }} />
        </div>
      </div>

      <div style={{ fontSize: 27, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
      </div>

      <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        {delta !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontWeight: 600,
            color: positive ? '#059669' : '#e11d48',
          }}>
            {positive ? <ArrowUpRight style={{ width: 13, height: 13 }} /> : <ArrowDownRight style={{ width: 13, height: 13 }} />}
            {Math.abs(delta)}%
          </span>
        )}
        {sub && <span style={{ color: '#64748b' }}>{sub}</span>}
      </div>
    </div>
  )
}

export default function KPICards({ kpis, hideCost = false }) {
  const avgMins     = Math.floor(kpis.avgDuration / 60)
  const avgSecs     = Math.round(kpis.avgDuration % 60)
  const successRate = kpis.total ? ((kpis.successful / kpis.total) * 100).toFixed(1) : '0.0'
  const failRate    = kpis.total ? ((kpis.failed    / kpis.total) * 100).toFixed(1) : '0.0'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
      <Card label="Total Calls" value={kpis.total.toLocaleString()} sub="all records"
            icon={PhoneCall} tone="blue" />
      <Card label="Avg Duration" value={`${avgMins}m ${avgSecs}s`} sub="per call"
            icon={Clock} tone="indigo" />
      <Card label="Success Rate" value={`${successRate}%`}
            delta={parseFloat(successRate) > 90 ? 2 : -2} sub="of total"
            icon={Activity} tone="success" />
      <Card label="Total Cost"
            value={`$${kpis.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            sub="billed" icon={DollarSign} tone="warning"
            locked={hideCost} />
      <Card label="Failed Calls" value={kpis.failed.toLocaleString()}
            delta={-parseFloat(failRate)} sub="of total"
            icon={PhoneOff} tone="danger" />
    </div>
  )
}