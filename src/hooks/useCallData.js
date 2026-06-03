import { useState, useEffect } from 'react'

export function useCallData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr')
      .then(res => res.json())
      .then(json => {
        console.log('First record:', json[0])
        console.log('callStatus value:', json[0].callStatus)
        console.log('callStatus type:', typeof json[0].callStatus)
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