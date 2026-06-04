import { useState, useEffect } from 'react'

let cachedData = null
let cacheTime = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

    fetch('https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr')
      .then(res => res.json())
      .then(json => {
        cachedData = json
        cacheTime = Date.now()
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}