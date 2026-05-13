import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSagaStore = defineStore('saga', () => {
  // IDs dos filmes assistidos na saga atual
  const watchedIds = ref(new Set())

  // IDs ordenados dos filmes da saga atual (para calcular "next")
  const orderedIds = ref([])

  // ID e nome da saga atual
  const currentSagaId = ref(null)
  const currentSagaName = ref('')

  const nextId = computed(() => {
    return orderedIds.value.find((id) => !watchedIds.value.has(id)) ?? null
  })

  const watchedCount = computed(() => watchedIds.value.size)

  function setCurrentSaga(sagaId, sagaName, movieIds) {
    currentSagaId.value = sagaId
    currentSagaName.value = sagaName
    orderedIds.value = movieIds

    // Carrega progresso salvo do localStorage (Sprint 4 expande isso)
    const saved = loadProgress(sagaId)
    watchedIds.value = new Set(saved)
  }

  function getStatus(tmdbId) {
    if (watchedIds.value.has(tmdbId)) return 'watched'
    if (nextId.value === tmdbId) return 'next'
    return 'upcoming'
  }

  function toggleWatched(tmdbId) {
    const updated = new Set(watchedIds.value)
    if (updated.has(tmdbId)) {
      updated.delete(tmdbId)
    } else {
      updated.add(tmdbId)
    }
    watchedIds.value = updated
    saveProgress(currentSagaId.value, [...updated])
  }

  function saveProgress(sagaId, ids) {
    if (!sagaId) return
    try {
      const raw = localStorage.getItem('watchflow_data')
      const data = raw ? JSON.parse(raw) : { sagas: {} }
      if (data.sagas[sagaId]) {
        data.sagas[sagaId].watched = ids
      }
      localStorage.setItem('watchflow_data', JSON.stringify(data))
    } catch {}
  }

  function loadProgress(sagaId) {
    try {
      const raw = localStorage.getItem('watchflow_data')
      if (!raw) return []
      const data = JSON.parse(raw)
      return data.sagas?.[sagaId]?.watched ?? []
    } catch {
      return []
    }
  }

  return {
    watchedIds,
    orderedIds,
    currentSagaId,
    currentSagaName,
    nextId,
    watchedCount,
    setCurrentSaga,
    getStatus,
    toggleWatched,
  }
})
