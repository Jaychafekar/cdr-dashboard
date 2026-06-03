import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, RefreshCw } from 'lucide-react'

export default function AIInsights({ data }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateInsights = async () => {
    if (!data.length) return
    setLoading(true)
    setError('')

    const summary = {
      totalCalls: data.length,
      totalCost: data.reduce((s, r) => s + parseFloat(r.callCost || 0), 0).toFixed(2),
      avgDuration: (data.reduce((s, r) => s + r.callDuration, 0) / data.length).toFixed(1),
      failed: data.filter(r => r.callStatus === false || r.callStatus === 'false').length,
      successful: data.filter(r => r.callStatus === true || r.callStatus === 'true').length,
      cities: [...new Set(data.map(r => r.city))],
      topCity: Object.entries(
        data.reduce((acc, r) => { acc[r.city] = (acc[r.city] || 0) + 1; return acc }, {})
      ).sort(([,a],[,b]) => b-a)[0]?.[0],
      highestCostCall: Math.max(...data.map(r => parseFloat(r.callCost || 0))).toFixed(2),
      longestCall: Math.max(...data.map(r => r.callDuration)),
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are a telecom analytics expert. Analyze this CDR data summary and give exactly 5 short bullet point insights. Each insight should be one sentence, actionable, and start with an emoji. No headers, no numbering, just 5 lines.

Data: ${JSON.stringify(summary)}`
          }]
        })
      })

      const result = await res.json()
      const text = result.content[0].text
      const lines = text.split('\n').filter(l => l.trim()).slice(0, 5)
      setInsights(lines)
    } catch (err) {
      setError('Failed to generate insights. Check your API key.')
    }

    setLoading(false)
  }

  useEffect(() => {
    if (data.length) generateInsights()
  }, [])

  return (
    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Sparkles className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analysing...' : 'Refresh'}
        </button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-purple-600 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
            AI is analysing your CDR data...
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && !error && insights.length > 0 && (
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm text-purple-900 dark:text-purple-100 bg-white dark:bg-purple-900 rounded-lg px-3 py-2 shadow-sm">
                {insight}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}