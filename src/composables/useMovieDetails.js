import { ref } from 'vue'
import { getMovieDetails, getPosterUrl } from '@/services/tmdb'

export function useMovieDetails() {
  const details = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetch(tmdbId) {
    if (!tmdbId) return
    loading.value = true
    error.value = null
    details.value = null

    try {
      const data = await getMovieDetails(tmdbId)

      const trailer = data.videos?.results?.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      ) ?? null

      const cast = (data.credits?.cast ?? [])
        .slice(0, 5)
        .map((a) => ({
          id: a.id,
          name: a.name,
          character: a.character,
          photo: getPosterUrl(a.profile_path, 'w185'),
          initials: a.name.split(' ').map((n) => n[0]).slice(0, 2).join(''),
        }))

      details.value = {
        id: data.id,
        title: data.title,
        year: data.release_date?.slice(0, 4) ?? '—',
        overview: data.overview || 'Sinopse não disponível.',
        rating: data.vote_average ? data.vote_average.toFixed(1) : null,
        backdrop: getPosterUrl(data.backdrop_path, 'w1280'),
        poster: getPosterUrl(data.poster_path, 'w342'),
        runtime: data.runtime ?? null,
        genres: (data.genres ?? []).map((g) => g.name).slice(0, 3),
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        cast,
      }
    } catch {
      error.value = 'Não foi possível carregar os detalhes.'
    } finally {
      loading.value = false
    }
  }

  function clear() {
    details.value = null
    error.value = null
    loading.value = false
  }

  return { details, loading, error, fetch, clear }
}
