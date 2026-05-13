import { ref } from 'vue'
import { searchCollections, searchMovies } from '@/services/tmdb'

export function useTMDB() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  let debounceTimer = null

  async function search(query) {
    clearTimeout(debounceTimer)
    error.value = null

    if (!query.trim()) {
      results.value = []
      loading.value = false
      return
    }

    loading.value = true

    debounceTimer = setTimeout(async () => {
      try {
        const collections = await searchCollections(query)

        if (collections.length > 0) {
          results.value = collections.map((c) => ({
            id: c.id,
            name: c.name,
            poster: c.poster_path,
            backdrop: c.backdrop_path,
            type: 'collection',
          }))
        } else {
          // fallback: busca direta por filmes
          const movies = await searchMovies(query)
          results.value = movies.slice(0, 8).map((m) => ({
            id: m.id,
            name: m.title,
            poster: m.poster_path,
            backdrop: m.backdrop_path,
            type: 'movie',
          }))
        }
      } catch (e) {
        error.value = 'Não foi possível buscar. Verifique sua conexão ou API key.'
        results.value = []
      } finally {
        loading.value = false
      }
    }, 400)
  }

  function clear() {
    clearTimeout(debounceTimer)
    results.value = []
    loading.value = false
    error.value = null
  }

  return { results, loading, error, search, clear }
}
