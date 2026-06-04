import { useState, useMemo } from 'react'
import { useCallData } from './hooks/useCallData'
import { getKPIs, getDurationStats, getCostByCity, getCallsPerHour, getCallsPerDay, getCallsByCity, isCallCompleted } from './utils/analytics'
import { useAuth } from './AuthContext'
import KPICards from './components/KPICards'
import DurationChart from './components/DurationChart'
import CostChart from './components/CostChart'
import ActivityTimeline from './components/ActivityTimeline'
import CityChart from './components/CityChart'
import CallLogsTable from './components/CallLogsTable'
import Sidebar from './components/Sidebar'
import { Search, Bell, ChevronDown } from 'lucide-react'

export default function App() {
  const { data, loading, error } = useCallData()
  const { user, logout } = useAuth()
  const [filters, setFilters] = useState({
    search: '', city: '', status: '', direction: '', startDate: '', endDate: ''
  })

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ search: '', city: '', status: '', direction: '', startDate: '', endDate: '' })
      return
    }
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const cities = useMemo(() => [...new Set(data.map(r => r.city))].sort(), [data])

  const filteredData = useMemo(() => data.filter(r => {
    const matchSearch = !filters.search || r.callerName.toLowerCase().includes(filters.search.toLowerCase())
    const matchCity   = !filters.city   || r.city === filters.city
    const matchStatus = !filters.status
      || (filters.status === 'success' && isCallCompleted(r))
      || (filters.status === 'failed'  && !isCallCompleted(r))
    const matchDir = !filters.direction
      || (filters.direction === 'inbound'  && (r.callDirection === true  || r.callDirection === 'true'))
      || (filters.direction === 'outbound' && (r.callDirection === false || r.callDirection === 'false'))
    const matchStart = !filters.startDate ||
      new Date(r.callStartTime) >= new Date(filters.startDate)
    const matchEnd = !filters.endDate ||
      new Date(r.callStartTime) <= new Date(filters.endDate + 'T23:59:59')
    return matchSearch && matchCity && matchStatus && matchDir && matchStart && matchEnd
  }), [data, filters])

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'
  const hasFilters = filters.city || filters.status || filters.direction || filters.search || filters.startDate || filters.endDate

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Loading CDR data…</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#e11d48', fontSize: 14 }}>Error loading data: {error}</p>
    </div>
  )

  const kpis          = getKPIs(filteredData)
  const durationStats = getDurationStats(filteredData)
  const costByCity    = getCostByCity(filteredData)
  const perHour       = getCallsPerHour(filteredData)
  const perDay        = getCallsPerDay(filteredData)
  const byCity        = getCallsByCity(filteredData)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes ping  { 75%,100%{transform:scale(2.2);opacity:0} }
        ::-webkit-scrollbar { width: 7px; height: 7px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8 }
        select option { background: #ffffff; color: #0f172a }
      `}</style>

      <Sidebar />

      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <header style={{
          height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 32px',
          background: '#ffffff', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 20,
        }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: '#0f172a' }}>CDR Dashboard</h1>

          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
            background: '#dbeafe', color: '#1d4ed8',
          }}>
            <span style={{ position: 'relative', width: 7, height: 7, display: 'inline-flex' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2563eb', opacity: 0.5, animation: 'ping 1.6s ease-in-out infinite' }} />
              <span style={{ position: 'relative', width: 7, height: 7, borderRadius: '50%', background: '#2563eb', display: 'block' }} />
            </span>
            Live Data
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#94a3b8' }} />
              <input
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                placeholder="Search caller name…"
                style={{
                  paddingLeft: 34, paddingRight: 14, height: 36, width: 240, borderRadius: 8,
                  background: '#ffffff', border: '1px solid #e2e8f0',
                  color: '#0f172a', fontSize: 13, outline: 'none',
                }}
              />
            </div>

            <button style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, background: '#ffffff', border: '1px solid #e2e8f0', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Bell style={{ width: 16, height: 16, color: '#64748b' }} />
              <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '2px solid #ffffff' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ width: 33, height: 33, borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12.5 }}>
                {initials}
              </div>
              <div style={{ lineHeight: 1.3 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{user?.name || 'User'}</p>
                <p style={{ fontSize: 11.5, color: '#64748b', textTransform: 'capitalize' }}>{user?.role || 'Member'}</p>
              </div>
              <button onClick={logout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ChevronDown style={{ width: 15, height: 15, color: '#94a3b8' }} />
              </button>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, padding: '28px 32px 44px', maxWidth: 1600, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: 10, padding: '12px 16px', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {[
                { key: 'city',      label: 'All Cities',     options: cities.map(c => ({ value: c, label: c })) },
                { key: 'status',    label: 'All Status',     options: [{ value: 'success', label: 'Completed' }, { value: 'failed', label: 'Failed' }] },
                { key: 'direction', label: 'All Directions', options: [{ value: 'inbound', label: 'Inbound' }, { value: 'outbound', label: 'Outbound' }] },
              ].map(f => (
                <select key={f.key} value={filters[f.key]} onChange={e => handleFilterChange(f.key, e.target.value)}
                  style={{
                    padding: '7px 30px 7px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    color: '#334155', appearance: 'none', outline: 'none', fontWeight: 500,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: 16,
                  }}
                >
                  <option value="">{f.label}</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ))}

              {/* Date Range */}
              <input
                type="date"
                value={filters.startDate}
                onChange={e => handleFilterChange('startDate', e.target.value)}
                style={{
                  padding: '7px 10px', borderRadius: 8, fontSize: 13,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#334155', outline: 'none', cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={e => handleFilterChange('endDate', e.target.value)}
                style={{
                  padding: '7px 10px', borderRadius: 8, fontSize: 13,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#334155', outline: 'none', cursor: 'pointer',
                }}
              />

              {hasFilters && (
                <button onClick={() => handleFilterChange('reset')} style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer',
                }}>
                  Clear
                </button>
              )}
            </div>
            <span style={{ fontSize: 12.5, color: '#64748b' }}>
              Updated just now · <strong style={{ color: '#0f172a' }}>{filteredData.length.toLocaleString()}</strong> records
            </span>
          </div>

          <KPICards kpis={kpis} />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
            <ActivityTimeline perHour={perHour} perDay={perDay} />
            <CityChart data={byCity} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <CostChart data={costByCity} />
            <DurationChart stats={durationStats} />
          </div>

          <CallLogsTable data={filteredData} />
        </div>
      </main>
    </div>
  )
}