<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCollection } from '@/services/tmdb'
import { useFlowBuilder } from '@/composables/useFlowBuilder'
import { useSagaStore } from '@/stores/sagaStore'
import FlowCanvas from '@/components/flow/FlowCanvas.vue'

const route = useRoute()
const router = useRouter()
const { buildFlow } = useFlowBuilder()
const store = useSagaStore()

const nodes = ref([])
const edges = ref([])
const loading = ref(true)
const error = ref(null)

const progressPercent = computed(() => {
  if (!nodes.value.length) return 0
  return Math.round((store.watchedCount / nodes.value.length) * 100)
})

onMounted(async () => {
  try {
    const collection = await getCollection(route.params.id)
    const flow = buildFlow(collection)
    nodes.value = flow.nodes
    edges.value = flow.edges

    // Inicializa a saga na store com os IDs em ordem
    const orderedIds = flow.nodes.map((n) => n.data.tmdbId)
    store.setCurrentSaga(
      Number(route.params.id),
      collection.name ?? '',
      orderedIds
    )
  } catch {
    error.value = 'Não foi possível carregar esta saga. Tente novamente.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="relative w-full" style="height: calc(100vh - 56px)">

    <!-- Loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
      style="background: var(--wf-bg-primary)"
    >
      <div
        class="w-8 h-8 rounded-full border-2 animate-spin"
        style="border-color: var(--wf-border); border-top-color: var(--wf-accent)"
      />
      <span class="text-sm" style="color: var(--wf-text-muted)">Carregando saga...</span>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
      style="background: var(--wf-bg-primary)"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--wf-text-faint)">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
      </svg>
      <p class="text-base" style="color: var(--wf-text-muted)">{{ error }}</p>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium"
        style="background: var(--wf-accent); color: #fff"
        @click="router.back()"
      >
        Voltar
      </button>
    </div>

    <!-- Flow -->
    <template v-else>
      <!-- Barra de topo: nome da saga + progresso -->
      <div
        class="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full pointer-events-none"
        style="background: var(--wf-bg-elevated); border: 1px solid var(--wf-border)"
      >
        <span class="text-sm font-medium" style="color: var(--wf-text-primary)">
          {{ store.currentSagaName }}
        </span>
        <span class="text-xs px-2 py-0.5 rounded-full" style="background: var(--wf-bg-primary); color: var(--wf-text-muted)">
          {{ store.watchedCount }}/{{ nodes.length }}
        </span>
        <div class="w-20 h-1.5 rounded-full overflow-hidden" style="background: var(--wf-border)">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: progressPercent + '%', background: progressPercent === 100 ? 'var(--wf-watched)' : 'var(--wf-accent)' }"
          />
        </div>
        <span class="text-xs" style="color: var(--wf-text-muted)">{{ progressPercent }}%</span>
      </div>

      <!-- Dica de interação (some após primeira ação) -->
      <div
        v-if="store.watchedCount === 0"
        class="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full text-xs pointer-events-none"
        style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
      >
        Clique em um nó para marcar como assistido
      </div>

      <FlowCanvas :nodes="nodes" :edges="edges" />
    </template>
  </div>
</template>
