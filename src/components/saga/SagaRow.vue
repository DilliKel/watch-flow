<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPosterUrl } from '@/services/tmdb'
import { useSagaStore } from '@/stores/sagaStore'
import SagaProgressBar from './SagaProgressBar.vue'

const props = defineProps({
  sagaId: { type: [String, Number], required: true },
  saga: { type: Object, required: true },
})

const router = useRouter()
const store = useSagaStore()

const progress = computed(() => store.getProgress(props.sagaId))
const posterUrl = computed(() => getPosterUrl(props.saga.poster, 'w92'))

function onContinue() {
  router.push({ name: 'flow', params: { id: props.sagaId } })
}

function onRemove() {
  store.removeSaga(props.sagaId)
}
</script>

<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
    style="background: var(--wf-bg-secondary); border: 1px solid var(--wf-border)"
    @mouseenter="$event.currentTarget.style.borderColor = 'var(--wf-border-accent)'"
    @mouseleave="$event.currentTarget.style.borderColor = 'var(--wf-border)'"
  >
    <!-- Pôster pequeno -->
    <div
      class="flex-shrink-0 rounded-lg overflow-hidden"
      style="width: 40px; height: 56px; background: var(--wf-bg-elevated)"
    >
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="saga.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--wf-text-faint)">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    </div>

    <!-- Info + barra -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1.5">
        <p class="text-sm font-medium truncate" style="color: var(--wf-text-primary)">
          {{ saga.name }}
        </p>
        <span
          v-if="progress.percent === 100"
          class="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-semibold"
          style="background: var(--wf-watched-bg); color: var(--wf-watched)"
        >✓</span>
      </div>
      <SagaProgressBar
        :percent="progress.percent"
        :watched="progress.watched"
        :total="progress.total"
      />
    </div>

    <!-- Ações -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <button
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style="background: var(--wf-accent); color: #fff"
        @click="onContinue"
        @mouseenter="$event.target.style.background = 'var(--wf-accent-light)'"
        @mouseleave="$event.target.style.background = 'var(--wf-accent)'"
      >
        {{ progress.watched === 0 ? 'Começar' : 'Continuar' }}
      </button>
      <button
        class="p-1.5 rounded-lg transition-colors"
        style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
        aria-label="Remover saga"
        @click="onRemove"
        @mouseenter="$event.currentTarget.style.color = '#F87171'; $event.currentTarget.style.borderColor = '#3F1F1F'"
        @mouseleave="$event.currentTarget.style.color = 'var(--wf-text-muted)'; $event.currentTarget.style.borderColor = 'var(--wf-border)'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  </div>
</template>
