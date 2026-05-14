<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCollection, getPosterUrl } from '@/services/tmdb'
import { useFlowBuilder } from '@/composables/useFlowBuilder'
import { useSagaStore } from '@/stores/sagaStore'
import confetti from 'canvas-confetti'
import FlowCanvas from '@/components/flow/FlowCanvas.vue'
import FlowList from '@/components/flow/FlowList.vue'
import MovieDrawer from '@/components/flow/MovieDrawer.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { buildFlow } = useFlowBuilder()
const store = useSagaStore()

const nodes = ref([])
const edges = ref([])
const loading = ref(true)
const error = ref(null)
const collectionMeta = ref(null)

// Backdrop + completion
const collectionBackdrop = ref(null)
const completionVisible = ref(false)

function triggerConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
  setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.5 } }), 400)
  completionVisible.value = true
  setTimeout(() => { completionVisible.value = false }, 3000)
}

watch(() => store.isCompleted, (val) => {
  if (val) triggerConfetti()
})

// Drawer
const drawerOpen = ref(false)
const selectedTmdbId = ref(null)

function openDrawer(tmdbId) {
  selectedTmdbId.value = tmdbId
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
  selectedTmdbId.value = null
}

const sagaId = computed(() => Number(route.params.id))
const isSaved = computed(() => !!store.savedSagas[sagaId.value])

const progressPercent = computed(() => {
  if (!nodes.value.length) return 0
  return Math.round((store.watchedCount / nodes.value.length) * 100)
})

function onSave() {
  if (!collectionMeta.value) return
  store.saveSaga({
    id: sagaId.value,
    name: collectionMeta.value.name ?? '',
    poster: collectionMeta.value.poster_path ?? null,
    totalMovies: nodes.value.length,
  })
}

onMounted(async () => {
  try {
    const collection = await getCollection(route.params.id)
    collectionMeta.value = collection
    const flow = buildFlow(collection)
    nodes.value = flow.nodes
    edges.value = flow.edges

    const orderedIds = flow.nodes.map((n) => n.data.tmdbId)
    store.setCurrentSaga(sagaId.value, collection.name ?? '', orderedIds)
    collectionBackdrop.value = collection.backdrop_path
      ? getPosterUrl(collection.backdrop_path, 'original')
      : null
  } catch {
    error.value = 'Não foi possível carregar esta saga. Tente novamente.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="relative w-full" style="height: calc(100vh - 56px)">

    <!-- Backdrop cinematográfico -->
    <div
      v-if="collectionBackdrop"
      class="absolute inset-0 pointer-events-none"
      style="z-index: 0; overflow: hidden"
    >
      <img
        :src="collectionBackdrop"
        class="absolute w-full h-full object-cover"
        style="filter: blur(10px) brightness(0.18); transform: scale(1.08)"
        alt=""
      />
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center z-10"
      style="background: var(--wf-bg-primary)"
    >
      <LoadingSpinner label="Carregando saga..." />
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
      <BaseButton variant="primary" @click="router.back()">Voltar</BaseButton>
    </div>

    <template v-else>

      <!-- ── Barra de topo ──────────────────────────────────────────── -->
      <div class="absolute top-4 left-4 right-4 z-10 flex items-center gap-3">
        <div
          class="flex items-center gap-3 px-4 py-2 rounded-full mx-auto pointer-events-none"
          style="background: var(--wf-bg-elevated); border: 1px solid var(--wf-border)"
        >
          <span class="text-sm font-medium hidden sm:inline" style="color: var(--wf-text-primary)">
            {{ store.currentSagaName }}
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full" style="background: var(--wf-bg-primary); color: var(--wf-text-muted)">
            {{ store.watchedCount }}/{{ nodes.length }}
          </span>
          <div class="w-20 h-1.5 rounded-full overflow-hidden" style="background: var(--wf-border)">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: progressPercent + '%',
                background: progressPercent === 100 ? 'var(--wf-watched)' : 'var(--wf-accent)'
              }"
            />
          </div>
          <span class="text-xs" style="color: var(--wf-text-muted)">{{ progressPercent }}%</span>
        </div>

        <!-- Botão favoritar -->
        <button
          class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all"
          :style="isSaved
            ? 'background: var(--wf-watched-bg); color: var(--wf-watched); border: 1px solid var(--wf-watched)'
            : 'background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)'"
          :aria-label="isSaved ? 'Saga salva em Minhas Sagas' : 'Salvar saga em Minhas Sagas'"
          @click="onSave"
        >
          <svg v-if="isSaved" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span class="hidden sm:inline">{{ isSaved ? 'Salva' : 'Salvar' }}</span>
        </button>
      </div>

      <!-- Banner Saga completa -->
      <Transition name="fade">
        <div
          v-if="completionVisible"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-8 py-5 rounded-2xl text-center pointer-events-none"
          style="background: var(--wf-bg-elevated); border: 1px solid var(--wf-watched); color: var(--wf-watched)"
        >
          <p class="text-2xl font-bold">🎉 Saga completa!</p>
        </div>
      </Transition>

      <!-- Dica inicial -->
      <Transition name="fade">
        <div
          v-if="store.watchedCount === 0"
          class="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full text-xs pointer-events-none hidden sm:block"
          style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
        >
          Clique em um filme para ver os detalhes
        </div>
      </Transition>

      <!-- Desktop: FlowCanvas -->
      <div class="hidden sm:block w-full h-full" style="position: relative; z-index: 1">
        <FlowCanvas :nodes="nodes" :edges="edges" @node-click="openDrawer" />
      </div>

      <!-- Mobile: lista -->
      <div class="sm:hidden w-full h-full overflow-y-auto" style="position: relative; z-index: 1; padding-top: 64px">
        <FlowList :nodes="nodes" @node-click="openDrawer" />
      </div>

    </template>

    <!-- Drawer de detalhes -->
    <MovieDrawer
      :tmdb-id="selectedTmdbId"
      :open="drawerOpen"
      @close="closeDrawer"
    />

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
