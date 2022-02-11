import { useState, useEffect, useContext } from 'react'
import { ApiFetch } from './ApiFetch'

export const useFetch = (url) => {
  const [data, setData] = useState(null)
  const apiFetch = useContext(ApiFetch)

  useEffect(() => {
    async function fetchData () {
      const json = await apiFetch(url)
      setData(json)
    }
    fetchData()
  }, [url, apiFetch])
  return data
}
