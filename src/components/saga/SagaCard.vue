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

const posterUrl = computed(() => getPosterUrl(props.saga.poster, 'w300'))

const savedDate = computed(() => {
  if (!props.saga.savedAt) return ''
  return new Date(props.saga.savedAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
})

function onContinue() {
  router.push({ name: 'flow', params: { id: props.sagaId } })
}

function onRemove() {
  store.removeSaga(props.sagaId)
}
</script>

<template>
  <article
    class="saga-card"
    style="background: var(--wf-bg-secondary); border: 1px solid var(--wf-border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: border-color 0.2s, transform 0.15s;"
    @mouseenter="$event.currentTarget.style.borderColor = 'var(--wf-border-accent)'"
    @mouseleave="$event.currentTarget.style.borderColor = 'var(--wf-border)'"
  >
    <!-- Pôster -->
    <div class="relative" style="aspect-ratio: 2/1; background: var(--wf-bg-primary); overflow: hidden;">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="saga.name"
        class="w-full h-full object-cover object-top opacity-60"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--wf-text-faint)">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
        </svg>
      </div>

      <!-- Gradiente sobre o pôster -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom, transparent 30%, var(--wf-bg-secondary) 100%)"
      />

      <!-- Badge de progresso sobre o pôster -->
      <div
        v-if="progress.percent === 100"
        class="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style="background: var(--wf-watched-bg); color: var(--wf-watched); border: 1px solid var(--wf-watched)"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5" /></svg>
        Completa
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="flex flex-col gap-3 p-4 flex-1">
      <div>
        <h3
          class="font-semibold text-sm leading-tight line-clamp-2"
          style="color: var(--wf-text-primary)"
        >
          {{ saga.name }}
        </h3>
        <p class="text-xs mt-1" style="color: var(--wf-text-faint)">
          Salva em {{ savedDate }}
        </p>
      </div>

      <SagaProgressBar
        :percent="progress.percent"
        :watched="progress.watched"
        :total="progress.total"
      />

      <!-- Ações -->
      <div class="flex gap-2 mt-auto pt-1">
        <button
          class="flex-1 py-2 rounded-lg text-xs font-medium transition-colors"
          style="background: var(--wf-accent); color: #fff;"
          @click="onContinue"
          @mouseenter="$event.target.style.background = 'var(--wf-accent-light)'"
          @mouseleave="$event.target.style.background = 'var(--wf-accent)'"
        >
          {{ progress.watched === 0 ? 'Começar' : 'Continuar' }}
        </button>
        <button
          class="px-3 py-2 rounded-lg text-xs transition-colors"
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
  </article>
</template>
