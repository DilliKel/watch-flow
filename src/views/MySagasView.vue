<script setup>
import { ref, computed, watch } from 'vue'
import { useSagaStore } from '@/stores/sagaStore'
import SagaCard from '@/components/saga/SagaCard.vue'
import SagaRow from '@/components/saga/SagaRow.vue'
import SagaTour from '@/components/ui/SagaTour.vue'

const store = useSagaStore()

const viewMode = ref(localStorage.getItem('wf_view_mode') ?? 'grid')
const sort = ref(localStorage.getItem('wf_sort') ?? 'date')

watch(viewMode, (v) => localStorage.setItem('wf_view_mode', v))
watch(sort, (v) => localStorage.setItem('wf_sort', v))

const sortOptions = [
  { value: 'date', label: 'Adicionado recentemente' },
  { value: 'name', label: 'Nome (A–Z)' },
  { value: 'progress', label: 'Mais avançado' },
  { value: 'progress-asc', label: 'Menos assistido' },
]

const sortedSagas = computed(() => {
  const entries = Object.entries(store.savedSagas)
  return entries.sort(([idA, a], [idB, b]) => {
    if (sort.value === 'name') return a.name.localeCompare(b.name)
    if (sort.value === 'date') return new Date(b.savedAt) - new Date(a.savedAt)
    if (sort.value === 'progress') {
      return store.getProgress(idB).percent - store.getProgress(idA).percent
    }
    return store.getProgress(idA).percent - store.getProgress(idB).percent
  })
})

const totalWatched = computed(() =>
  Object.values(store.savedSagas).reduce((acc, s) => acc + (s.watched?.length ?? 0), 0)
)
</script>

<template>
  <div class="px-6 py-8 max-w-5xl mx-auto">

    <!-- Header da tela -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold" style="color: var(--wf-text-primary)" data-tour="sagas-header">
            Minhas Sagas
          </h1>
          <SagaTour />
        </div>
        <p class="text-sm mt-1" style="color: var(--wf-text-muted)">
          {{ sortedSagas.length }} saga{{ sortedSagas.length !== 1 ? 's' : '' }} salva{{ sortedSagas.length !== 1 ? 's' : '' }}
          <span v-if="totalWatched > 0">
            · {{ totalWatched }} filme{{ totalWatched !== 1 ? 's' : '' }} assistido{{ totalWatched !== 1 ? 's' : '' }}
          </span>
        </p>
      </div>

      <!-- Controles (só quando há sagas) -->
      <div v-if="sortedSagas.length > 0" class="flex items-center gap-2 flex-wrap">

        <!-- Ordenação -->
        <select
          v-model="sort"
          data-tour="sagas-sort"
          class="text-xs px-2.5 py-2 rounded-lg outline-none cursor-pointer"
          style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <!-- Toggle grid / lista -->
        <div
          data-tour="sagas-viewmode"
          class="flex rounded-lg overflow-hidden"
          style="border: 1px solid var(--wf-border)"
        >
          <button
            class="flex items-center justify-center w-8 h-8 transition-colors"
            :style="viewMode === 'grid'
              ? 'background: var(--wf-bg-elevated); color: var(--wf-text-primary)'
              : 'background: transparent; color: var(--wf-text-faint)'"
            aria-label="Visualização em grade"
            @click="viewMode = 'grid'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            class="flex items-center justify-center w-8 h-8 transition-colors"
            :style="viewMode === 'list'
              ? 'background: var(--wf-bg-elevated); color: var(--wf-text-primary)'
              : 'background: transparent; color: var(--wf-text-faint)'"
            aria-label="Visualização em lista"
            @click="viewMode = 'list'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>
        </div>

        <!-- Explorar mais -->
        <RouterLink
          to="/"
          class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          Explorar mais
        </RouterLink>
      </div>
    </div>

    <template v-if="sortedSagas.length > 0">
      <!-- Grade de cards -->
      <div
        v-if="viewMode === 'grid'"
        class="grid gap-4"
        style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))"
      >
        <SagaCard
          v-for="[id, saga] in sortedSagas"
          :key="id"
          :saga-id="id"
          :saga="saga"
        />
      </div>

      <!-- Lista compacta -->
      <div v-else class="flex flex-col gap-2">
        <SagaRow
          v-for="[id, saga] in sortedSagas"
          :key="id"
          :saga-id="id"
          :saga="saga"
        />
      </div>
    </template>

    <!-- Estado vazio -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center"
        style="background: var(--wf-bg-elevated)"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="color: var(--wf-text-faint)">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>

      <div class="text-center">
        <h2 class="text-lg font-semibold" style="color: var(--wf-text-primary)">
          Nenhuma saga ainda
        </h2>
        <p class="text-sm mt-1 max-w-xs" style="color: var(--wf-text-muted)">
          Busque uma franquia, abra o flow e ela aparece aqui automaticamente.
        </p>
      </div>

      <RouterLink
        to="/"
        class="mt-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        style="background: var(--wf-accent); color: #fff"
      >
        Explorar sagas
      </RouterLink>
    </div>

  </div>
</template>
