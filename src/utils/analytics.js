export const COMPLETED_THRESHOLD_SECONDS = 10

export function isCallCompleted(r) {
  return Number(r.callDuration) >= COMPLETED_THRESHOLD_SECONDS
}

export function getKPIs(data) {
  const total = data.length
  const totalCost = data.reduce((sum, r) => sum + parseFloat(r.callCost || 0), 0)
  const avgDuration = total ? data.reduce((sum, r) => sum + r.callDuration, 0) / total : 0
  const successful = data.filter(isCallCompleted).length
  const failed = total - successful
  return { total, totalCost, avgDuration, successful, failed }
}

export function getDurationStats(data) {
  if (!data.length) return { longest: 0, shortest: 0, average: 0, byName: [] }
  const sorted = [...data].sort((a, b) => b.callDuration - a.callDuration)
  return {
    longest: sorted[0].callDuration,
    shortest: sorted[sorted.length - 1].callDuration,
    average: data.reduce((s, r) => s + r.callDuration, 0) / data.length,
    byName: sorted.slice(0, 10).map(r => ({ name: r.callerName, duration: r.callDuration })),
  }
}

export function getCostByCity(data) {
  const map = {}
  data.forEach(r => {
    if (!map[r.city]) map[r.city] = { city: r.city, totalCost: 0, count: 0 }
    map[r.city].totalCost += parseFloat(r.callCost || 0)
    map[r.city].count += 1
  })
  return Object.values(map)
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 10)
    .map(c => ({
      city: c.city,
      totalCost: parseFloat(c.totalCost.toFixed(2)),
      avgCost: parseFloat((c.totalCost / c.count).toFixed(2)),
    }))
}

export function getCallsPerHour(data) {
  const map = {}
  data.forEach(r => {
    const hour = new Date(r.callStartTime).getHours()
    map[hour] = (map[hour] || 0) + 1
  })
  return Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, calls: map[h] || 0 }))
}

export function getCallsPerDay(data) {
  const map = {}
  data.forEach(r => {
    const day = new Date(r.callStartTime).toISOString().split('T')[0]
    map[day] = (map[day] || 0) + 1
  })
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, calls]) => ({ day, calls }))
}

export function getCallsByCity(data) {
  const map = {}
  data.forEach(r => { map[r.city] = (map[r.city] || 0) + 1 })
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([city, calls]) => ({ city, calls }))
}