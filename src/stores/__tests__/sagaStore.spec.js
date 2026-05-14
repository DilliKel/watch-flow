import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSagaStore } from '../sagaStore'

describe('sagaStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ── setCurrentSaga ──────────────────────────────────────────────────────

  describe('setCurrentSaga', () => {
    it('popula orderedIds com os IDs fornecidos', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      expect(store.orderedIds).toEqual([101, 102, 103])
    })

    it('inicia watchedIds vazio quando saga não foi salva', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      expect(store.watchedIds.size).toBe(0)
    })

    it('restaura watchedIds a partir de savedSagas', () => {
      const store = useSagaStore()
      store.savedSagas[1] = { name: 'MCU', poster: null, totalMovies: 3, savedAt: '', watched: [101, 102] }
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      expect(store.watchedIds.has(101)).toBe(true)
      expect(store.watchedIds.has(102)).toBe(true)
      expect(store.watchedIds.has(103)).toBe(false)
    })
  })

  // ── toggleWatched ───────────────────────────────────────────────────────

  describe('toggleWatched', () => {
    it('adiciona o filme ao Set ao marcar', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      store.toggleWatched(101)
      expect(store.watchedIds.has(101)).toBe(true)
    })

    it('remove o filme do Set ao desmarcar', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      store.toggleWatched(101)
      store.toggleWatched(101)
      expect(store.watchedIds.has(101)).toBe(false)
    })

    it('atualiza o array watched na saga já salva', () => {
      const store = useSagaStore()
      store.savedSagas[1] = { name: 'MCU', poster: null, totalMovies: 3, savedAt: '', watched: [] }
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      store.toggleWatched(101)
      expect(store.savedSagas[1].watched).toContain(101)
    })
  })

  // ── getStatus ───────────────────────────────────────────────────────────

  describe('getStatus', () => {
    it('retorna watched para filme já assistido', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      store.toggleWatched(101)
      expect(store.getStatus(101)).toBe('watched')
    })

    it('retorna next para o primeiro filme não-assistido em ordem', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      store.toggleWatched(101)
      expect(store.getStatus(102)).toBe('next')
    })

    it('retorna upcoming para filmes após o next', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      store.toggleWatched(101)
      expect(store.getStatus(103)).toBe('upcoming')
    })

    it('retorna next para o primeiro filme quando nenhum foi assistido', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102])
      expect(store.getStatus(101)).toBe('next')
      expect(store.getStatus(102)).toBe('upcoming')
    })
  })

  // ── nextId ──────────────────────────────────────────────────────────────

  describe('nextId', () => {
    it('aponta para o primeiro ID não-assistido', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102, 103])
      expect(store.nextId).toBe(101)
      store.toggleWatched(101)
      expect(store.nextId).toBe(102)
    })

    it('é null quando todos os filmes foram assistidos', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101])
      store.toggleWatched(101)
      expect(store.nextId).toBeNull()
    })
  })

  // ── getProgress ─────────────────────────────────────────────────────────

  describe('getProgress', () => {
    it('retorna 0% quando nenhum filme foi assistido', () => {
      const store = useSagaStore()
      store.savedSagas[1] = { name: 'MCU', poster: null, totalMovies: 4, savedAt: '', watched: [] }
      expect(store.getProgress(1)).toEqual({ watched: 0, total: 4, percent: 0 })
    })

    it('retorna 50% para metade assistida', () => {
      const store = useSagaStore()
      store.savedSagas[1] = { name: 'MCU', poster: null, totalMovies: 4, savedAt: '', watched: [101, 102] }
      expect(store.getProgress(1)).toEqual({ watched: 2, total: 4, percent: 50 })
    })

    it('retorna 100% quando a saga está completa', () => {
      const store = useSagaStore()
      store.savedSagas[1] = { name: 'MCU', poster: null, totalMovies: 2, savedAt: '', watched: [101, 102] }
      expect(store.getProgress(1)).toEqual({ watched: 2, total: 2, percent: 100 })
    })

    it('retorna zeros para saga não encontrada', () => {
      const store = useSagaStore()
      expect(store.getProgress(999)).toEqual({ watched: 0, total: 0, percent: 0 })
    })
  })

  // ── isCompleted ─────────────────────────────────────────────────────────

  describe('isCompleted', () => {
    it('é false quando orderedIds está vazio', () => {
      const store = useSagaStore()
      expect(store.isCompleted).toBe(false)
    })

    it('é false quando há filmes não-assistidos', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102])
      store.toggleWatched(101)
      expect(store.isCompleted).toBe(false)
    })

    it('é true quando todos os filmes foram assistidos', () => {
      const store = useSagaStore()
      store.setCurrentSaga(1, 'MCU', [101, 102])
      store.toggleWatched(101)
      store.toggleWatched(102)
      expect(store.isCompleted).toBe(true)
    })
  })

  // ── removeSaga ──────────────────────────────────────────────────────────

  describe('removeSaga', () => {
    it('remove a saga do savedSagas', () => {
      const store = useSagaStore()
      store.savedSagas[1] = { name: 'MCU', poster: null, totalMovies: 3, savedAt: '', watched: [] }
      store.removeSaga(1)
      expect(store.savedSagas[1]).toBeUndefined()
    })
  })
})
