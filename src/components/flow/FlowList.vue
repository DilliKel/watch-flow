<script setup>
import { computed } from 'vue'
import { useSagaStore } from '@/stores/sagaStore'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
})

const store = useSagaStore()

const movies = computed(() =>
  [...props.nodes].sort((a, b) => a.data.order - b.data.order)
)

const statusLabel = { watched: 'Assistido', next: 'Próximo', upcoming: 'Em seguida' }
const statusColor = {
  watched: 'var(--wf-watched)',
  next: 'var(--wf-accent)',
  upcoming: 'var(--wf-text-faint)',
}
</script>

<template>
  <div class="px-4 pb-8">
    <p class="text-xs mb-4 text-center" style="color: var(--wf-text-faint)">
      Toque em um filme para marcar como assistido
    </p>

    <div class="flex flex-col gap-2">
      <button
        v-for="node in movies"
        :key="node.id"
        class="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-colors"
        :style="{
          background: 'var(--wf-bg-elevated)',
          border: `1px solid ${statusColor[store.getStatus(node.data.tmdbId)]}33`,
          opacity: store.getStatus(node.data.tmdbId) === 'upcoming' ? 0.6 : 1,
        }"
        @click="store.toggleWatched(node.data.tmdbId)"
      >
        <!-- Pôster miniatura -->
        <div class="flex-shrink-0 w-8 h-12 rounded overflow-hidden" style="background: var(--wf-bg-primary)">
          <img
            v-if="node.data.poster"
            :src="node.data.poster"
            :alt="node.data.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate" style="color: var(--wf-text-primary)">
            {{ node.data.order }}. {{ node.data.title }}
          </p>
          <p class="text-xs mt-0.5" style="color: var(--wf-text-muted)">{{ node.data.year }}</p>
        </div>

        <!-- Status badge -->
        <span
          class="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
          :style="{
            color: statusColor[store.getStatus(node.data.tmdbId)],
            background: `${statusColor[store.getStatus(node.data.tmdbId)]}18`,
          }"
        >
          {{ statusLabel[store.getStatus(node.data.tmdbId)] }}
        </span>
      </button>
    </div>
  </div>
</template>
