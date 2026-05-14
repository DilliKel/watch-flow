import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'watchflow_data'

export const useSagaStore = defineStore('saga', () => {
  // Todas as sagas salvas: { [sagaId]: { name, poster, totalMovies, savedAt, watched[] } }
  const savedSagas = ref({})

  // Saga sendo visualizada no momento
  const currentSagaId = ref(null)
  const currentSagaName = ref('')
  const orderedIds = ref([])
  const watchedIds = ref(new Set())

  const nextId = computed(() =>
    orderedIds.value.find((id) => !watchedIds.value.has(id)) ?? null
  )

  const watchedCount = computed(() => watchedIds.value.size)

  // ── Persistência ─────────────────────────────────────────────────────────

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      savedSagas.value = data.sagas ?? {}
    } catch {}
  }

  function _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sagas: savedSagas.value }))
    } catch {}
  }

  // ── Saga atual ───────────────────────────────────────────────────────────

  function saveSaga({ id, name, poster, totalMovies }) {
    const existing = savedSagas.value[id]
    // Se é a saga atual, captura o progresso em memória no momento do clique
    const currentWatched =
      currentSagaId.value === id ? [...watchedIds.value] : (existing?.watched ?? [])
    savedSagas.value = {
      ...savedSagas.value,
      [id]: {
        name,
        poster,
        totalMovies,
        savedAt: existing?.savedAt ?? new Date().toISOString(),
        watched: currentWatched,
      },
    }
    _persist()
  }

  function setCurrentSaga(sagaId, sagaName, movieIds) {
    currentSagaId.value = sagaId
    currentSagaName.value = sagaName
    orderedIds.value = movieIds
    const saved = savedSagas.value[sagaId]?.watched ?? []
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
    if (sagaId && savedSagas.value[sagaId]) {
      savedSagas.value = {
        ...savedSagas.value,
        [sagaId]: { ...savedSagas.value[sagaId], watched: [...updated] },
      }
      _persist()
    }
  }

  // ── Painel pessoal ───────────────────────────────────────────────────────

  function getProgress(sagaId) {
    const saga = savedSagas.value[sagaId]
    if (!saga) return { watched: 0, total: 0, percent: 0 }
    const watched = saga.watched?.length ?? 0
    const total = saga.totalMovies ?? 0
    return { watched, total, percent: total > 0 ? Math.round((watched / total) * 100) : 0 }
  }

  function removeSaga(sagaId) {
    const updated = { ...savedSagas.value }
    delete updated[sagaId]
    savedSagas.value = updated
    _persist()
  }

  return {
    savedSagas,
    currentSagaId,
    currentSagaName,
    orderedIds,
    watchedIds,
    nextId,
    watchedCount,
    loadFromStorage,
    saveSaga,
    setCurrentSaga,
    getStatus,
    toggleWatched,
    getProgress,
    removeSaga,
  }
})
