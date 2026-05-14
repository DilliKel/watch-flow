<script setup>
import { computed } from 'vue'
import { useSagaStore } from '@/stores/sagaStore'
import SagaCard from '@/components/saga/SagaCard.vue'

const store = useSagaStore()

const sagas = computed(() => Object.entries(store.savedSagas))

const totalWatched = computed(() =>
  Object.values(store.savedSagas).reduce((acc, s) => acc + (s.watched?.length ?? 0), 0)
)
</script>

<template>
  <div class="px-6 py-8 max-w-5xl mx-auto">

    <!-- Header da tela -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold" style="color: var(--wf-text-primary)">
          Minhas Sagas
        </h1>
        <p class="text-sm mt-1" style="color: var(--wf-text-muted)">
          {{ sagas.length }} saga{{ sagas.length !== 1 ? 's' : '' }} salva{{ sagas.length !== 1 ? 's' : '' }}
          <span v-if="totalWatched > 0">
            · {{ totalWatched }} filme{{ totalWatched !== 1 ? 's' : '' }} assistido{{ totalWatched !== 1 ? 's' : '' }}
          </span>
        </p>
      </div>

      <RouterLink
        v-if="sagas.length > 0"
        to="/"
        class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        Explorar mais
      </RouterLink>
    </div>

    <!-- Grid de cards -->
    <div
      v-if="sagas.length > 0"
      class="grid gap-4"
      style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))"
    >
      <SagaCard
        v-for="[id, saga] in sagas"
        :key="id"
        :saga-id="id"
        :saga="saga"
      />
    </div>

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
