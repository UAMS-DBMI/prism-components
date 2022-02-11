import React from 'react'

const basicFetch = async (url, opts = {}) => {
  const response = await fetch(url, opts)
  return await response.json()
}

export const fallbackFetch = contextFetch => {
  const myFetch = contextFetch || basicFetch

  return myFetch
}

export const ApiFetch = React.createContext(basicFetch)
