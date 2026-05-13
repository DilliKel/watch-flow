<script setup>
import { ref, markRaw, watch, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { useSagaStore } from '@/stores/sagaStore'
import MovieNode from './MovieNode.vue'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
})

const nodeTypes = { movie: markRaw(MovieNode) }

const store = useSagaStore()
const { fitView, findNode } = useVueFlow()

async function zoomToNext() {
  await nextTick()
  const nextId = store.nextId
  if (nextId) {
    const node = findNode(String(nextId))
    if (node) {
      fitView({ nodes: [node], padding: 0.6, duration: 500 })
      return
    }
  }
  fitView({ padding: 0.12, duration: 400 })
}

// Centraliza no "next" sempre que os nós carregam ou o progresso muda
watch(() => props.nodes, async (newNodes) => {
  if (newNodes.length) await zoomToNext()
}, { immediate: true })

watch(() => store.nextId, async () => {
  if (props.nodes.length) await zoomToNext()
})
</script>

<template>
  <div class="w-full h-full">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.1"
      :max-zoom="4"
      class="wf-flow"
    >
      <MiniMap
        :node-color="(node) => {
          const s = store.getStatus(node.data?.tmdbId)
          if (s === 'watched') return 'var(--wf-watched)'
          if (s === 'next') return 'var(--wf-accent)'
          return 'var(--wf-upcoming)'
        }"
        :mask-color="'rgba(13,13,15,0.7)'"
        position="bottom-right"
      />
      <Controls position="bottom-left" />
      <template #background>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--wf-text-faint)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="var(--wf-bg-primary)" />
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/minimap/dist/style.css';
@import '@vue-flow/controls/dist/style.css';

.wf-flow {
  background: var(--wf-bg-primary);
}

.vue-flow__controls {
  background: var(--wf-bg-elevated);
  border: 1px solid var(--wf-border);
  border-radius: 8px;
  box-shadow: none;
}

.vue-flow__controls-button {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--wf-border);
  color: var(--wf-text-muted);
  fill: var(--wf-text-muted);
}

.vue-flow__controls-button:hover {
  background: var(--wf-bg-secondary);
  fill: var(--wf-accent-light);
}

.vue-flow__controls-button:last-child {
  border-bottom: none;
}

.vue-flow__minimap {
  background: var(--wf-bg-elevated) !important;
  border: 1px solid var(--wf-border);
  border-radius: 8px;
}

/* Remove a sombra padrão dos nós do VueFlow */
.vue-flow__node {
  box-shadow: none !important;
}

.vue-flow__node:focus {
  outline: none;
}
</style>
