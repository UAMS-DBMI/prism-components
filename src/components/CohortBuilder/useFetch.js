import { useState, useEffect } from 'react'

export const useFetch = (url, apiKey) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData () {
      const response = await fetch(url)
      const json = await response.json()
      setData(json)
    }
    fetchData()
  }, [url, apiKey])
  return data
}
