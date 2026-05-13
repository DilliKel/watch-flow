import { getPosterUrl } from '@/services/tmdb'
import { buildLayout } from '@/utils/flowLayout'

export function useFlowBuilder() {
  function buildFlow(collection) {
    const movies = [...(collection.parts ?? [])]
      .sort((a, b) => {
        const da = a.release_date ?? '9999'
        const db = b.release_date ?? '9999'
        return da.localeCompare(db)
      })

    const positions = buildLayout(movies)

    const nodes = movies.map((movie, i) => ({
      id: String(movie.id),
      type: 'movie',
      position: positions[i],
      data: {
        title: movie.title,
        year: movie.release_date?.slice(0, 4) ?? '—',
        poster: getPosterUrl(movie.poster_path),
        tmdbId: movie.id,
        order: i + 1,
        status: 'upcoming',
      },
    }))

    const edges = movies.slice(0, -1).map((movie, i) => ({
      id: `e-${movie.id}-${movies[i + 1].id}`,
      source: String(movie.id),
      target: String(movies[i + 1].id),
      animated: true,
      style: { stroke: 'var(--wf-edge-default)', strokeWidth: 2 },
    }))

    return { nodes, edges }
  }

  return { buildFlow }
}
