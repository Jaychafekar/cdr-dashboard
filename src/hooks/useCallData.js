import { useState, useEffect } from 'react'
import API_URL from '../config'

let cachedData = null
let cacheTime = null
const CACHE_DURATION = 5 * 60 * 1000

export function useCallData() {
  const [data, setData] = useState(cachedData || [])
  const [loading, setLoading] = useState(!cachedData)
  const [error, setError] = useState(null)

  useEffect(() => {
    const now = Date.now()
    if (cachedData && cacheTime && now - cacheTime < CACHE_DURATION) {
      setData(cachedData)
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')

    const fetchData = async () => {
      try {
        let json

        if (token) {
          // Try backend first
          const res = await fetch(`${API_URL}/api/cdr?limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const result = await res.json()
            json = result.data || result
          }
        }

        // Fallback to mock API if backend fails or no token
        if (!json) {
          const res = await fetch('https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr')
          json = await res.json()
        }

        cachedData = json
        cacheTime = Date.now()
        setData(json)
        setLoading(false)
      } catch (err) {
        // Final fallback to mock API
        try {
          const res = await fetch('https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr')
          const json = await res.json()
          cachedData = json
          cacheTime = Date.now()
          setData(json)
          setLoading(false)
        } catch (e) {
          setError(e.message)
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}