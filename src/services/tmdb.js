const BASE = import.meta.env.VITE_TMDB_BASE_URL
const KEY = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE

async function request(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${res.statusText}`)
  return res.json()
}

export function getPosterUrl(posterPath, size = 'w300') {
  if (!posterPath) return null
  const base = import.meta.env.VITE_TMDB_IMAGE_BASE?.replace('w300', size) ?? IMAGE_BASE
  return `${base}${posterPath}`
}

export async function searchCollections(query) {
  const data = await request(
    `/search/collection?api_key=${KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
  )
  return data.results ?? []
}

export async function getCollection(id) {
  return request(`/collection/${id}?api_key=${KEY}&language=pt-BR`)
}

export async function searchMovies(query) {
  const data = await request(
    `/search/movie?api_key=${KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
  )
  return data.results ?? []
}
