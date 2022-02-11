export const apiFetch = async (url, apiKey) => {
  console.log(apiKey)
  const response = await fetch(url)
  return await response.json()
}
