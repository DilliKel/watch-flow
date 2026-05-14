import { useSagaStore } from '@/stores/sagaStore'

export function useProgress() {
  const store = useSagaStore()

  function loadFromStorage() {
    store.loadFromStorage()
  }

  function saveToStorage(data) {
    store.saveSaga(data)
  }

  return { loadFromStorage, saveToStorage }
}
