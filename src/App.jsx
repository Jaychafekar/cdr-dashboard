import { useState, useMemo } from 'react'
import { useCallData } from './hooks/useCallData'
import { getKPIs, getDurationStats, getCostByCity, getCallsPerHour, getCallsPerDay, getCallsByCity } from './utils/analytics'
import { useAuth } from './AuthContext'
import KPICards from './components/KPICards'
import DurationChart from './components/DurationChart'
import CostChart from './components/CostChart'
import ActivityTimeline from './components/ActivityTimeline'
import CityChart from './components/CityChart'
import CallLogsTable from './components/CallLogsTable'
import FilterBar from './components/FilterBar'
import { Moon, Sun } from 'lucide-react'

export default function App() {
  const { data, loading, error } = useCallData()
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    city: '',
    status: '',
    direction: ''
  })

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ search: '', city: '', status: '', direction: '' })
      return
    }
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const cities = useMemo(() => {
    return [...new Set(data.map(r => r.city))].sort()
  }, [data])

  const filteredData = useMemo(() => {
    return data.filter(r => {
      const matchSearch = filters.search === '' ||
        r.callerName.toLowerCase().includes(filters.search.toLowerCase())
      const matchCity = filters.city === '' || r.city === filters.city
      const matchStatus = filters.status === '' ||
        (filters.status === 'success' && (r.callStatus === true || r.callStatus === 'true')) ||
        (filters.status === 'failed' && (r.callStatus === false || r.callStatus === 'false'))
      const matchDirection = filters.direction === '' ||
        (filters.direction === 'inbound' && (r.callDirection === true || r.callDirection === 'true')) ||
        (filters.direction === 'outbound' && (r.callDirection === false || r.callDirection === 'false'))
      return matchSearch && matchCity && matchStatus && matchDirection
    })
  }, [data, filters])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Loading CDR data...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-destructive">Error loading data: {error}</p>
    </div>
  )

  const kpis = getKPIs(filteredData)
  const durationStats = getDurationStats(filteredData)
  const costByCity = getCostByCity(filteredData)
  const perHour = getCallsPerHour(filteredData)
  const perDay = getCallsPerDay(filteredData)
  const byCity = getCallsByCity(filteredData)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <header className="border-b px-6 py-4 bg-card flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">📞 CDR Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Call Data Records — Real-time Insights</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span className="text-sm text-muted-foreground">
              👤 {user?.name} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-6 space-y-6 max-w-[1400px] mx-auto">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            cities={cities}
          />
          <KPICards kpis={kpis} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DurationChart stats={durationStats} />
            <CostChart data={costByCity} />
          </div>
          <ActivityTimeline perHour={perHour} perDay={perDay} />
          <CityChart data={byCity} />
          <CallLogsTable data={filteredData} />
        </main>
      </div>
    </div>
  )
}