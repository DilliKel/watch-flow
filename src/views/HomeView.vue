<script setup>
import { useRouter } from 'vue-router'
import SearchBar from '@/components/search/SearchBar.vue'
import SearchResults from '@/components/search/SearchResults.vue'
import { useTMDB } from '@/composables/useTMDB'

const router = useRouter()
const { results, loading, error, search, clear } = useTMDB()

function onSelect(item) {
  router.push({ name: 'flow', params: { id: item.id }, query: { type: item.type } })
}
</script>

<template>
  <div class="flex flex-col items-center px-6 pt-20 pb-12">
    <h1
      class="font-display text-5xl tracking-widest mb-2"
      style="color: var(--wf-text-primary)"
    >
      WATCHFLOW
    </h1>
    <p class="text-base mb-10" style="color: var(--wf-text-muted)">
      Visualize e acompanhe suas sagas de filmes e séries
    </p>

    <div class="w-full max-w-xl">
      <SearchBar @search="search" @clear="clear" />
      <SearchResults
        :results="results"
        :loading="loading"
        :error="error"
        @select="onSelect"
      />
    </div>

    <!-- Sugestões quando vazio -->
    <div v-if="!results.length && !loading && !error" class="mt-12 flex flex-wrap justify-center gap-2">
      <span class="text-sm mr-2" style="color: var(--wf-text-faint)">Experimente:</span>
      <button
        v-for="hint in ['Marvel', 'Star Wars', 'Senhor dos Anéis', 'Matrix', 'Velozes e Furiosos']"
        :key="hint"
        class="px-3 py-1 rounded-full text-sm transition-colors"
        style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
        @click="search(hint)"
        @mouseenter="$event.target.style.color = 'var(--wf-accent-light)'; $event.target.style.borderColor = 'var(--wf-border-accent)'"
        @mouseleave="$event.target.style.color = 'var(--wf-text-muted)'; $event.target.style.borderColor = 'var(--wf-border)'"
      >
        {{ hint }}
      </button>
    </div>
  </div>
</template>
