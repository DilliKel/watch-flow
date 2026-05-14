import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useSagaStore = defineStore('saga', () => {
  // reactive({}) garante rastreamento de adição/remoção de chaves pelo Vue
  const savedSagas = reactive({})

  const currentSagaId = ref(null)
  const currentSagaName = ref('')
  const orderedIds = ref([])
  const watchedIds = ref(new Set())

  const nextId = computed(() =>
    orderedIds.value.find((id) => !watchedIds.value.has(id)) ?? null
  )

  const watchedCount = computed(() => watchedIds.value.size)

  const isCompleted = computed(
    () => orderedIds.value.length > 0 && watchedIds.value.size === orderedIds.value.length
  )

  // ── Saga atual ───────────────────────────────────────────────────────────

  function saveSaga({ id, name, poster, totalMovies }) {
    const existing = savedSagas[id]
    const currentWatched =
      currentSagaId.value === id ? [...watchedIds.value] : (existing?.watched ?? [])
    savedSagas[id] = {
      name,
      poster,
      totalMovies,
      savedAt: existing?.savedAt ?? new Date().toISOString(),
      watched: currentWatched,
    }
  }

  function setCurrentSaga(sagaId, sagaName, movieIds) {
    currentSagaId.value = sagaId
    currentSagaName.value = sagaName
    orderedIds.value = movieIds
    const saved = savedSagas[sagaId]?.watched ?? []
    watchedIds.value = new Set(saved)
  }

  function getStatus(tmdbId) {
    if (watchedIds.value.has(tmdbId)) return 'watched'
    if (nextId.value === tmdbId) return 'next'
    return 'upcoming'
  }

  function toggleWatched(tmdbId) {
    const updated = new Set(watchedIds.value)
    updated.has(tmdbId) ? updated.delete(tmdbId) : updated.add(tmdbId)
    watchedIds.value = updated

    const sagaId = currentSagaId.value
    if (sagaId && savedSagas[sagaId]) {
      savedSagas[sagaId].watched = [...updated]
    }
  }

  // ── Painel pessoal ───────────────────────────────────────────────────────

  function getProgress(sagaId) {
    const saga = savedSagas[sagaId]
    if (!saga) return { watched: 0, total: 0, percent: 0 }
    const watched = saga.watched?.length ?? 0
    const total = saga.totalMovies ?? 0
    return { watched, total, percent: total > 0 ? Math.round((watched / total) * 100) : 0 }
  }

  function removeSaga(sagaId) {
    delete savedSagas[sagaId]
  }

  return {
    savedSagas,
    currentSagaId,
    currentSagaName,
    orderedIds,
    watchedIds,
    nextId,
    watchedCount,
    isCompleted,
    saveSaga,
    setCurrentSaga,
    getStatus,
    toggleWatched,
    getProgress,
    removeSaga,
  }
}, {
  persist: {
    key: 'watchflow_data',
    paths: ['savedSagas'],
  },
})
