<script setup>
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { useSagaStore } from '@/stores/sagaStore'

const props = defineProps({
  data: { type: Object, required: true },
})

const store = useSagaStore()

const status = computed(() => store.getStatus(props.data.tmdbId))

const borderColor = computed(() => {
  if (status.value === 'watched') return 'var(--wf-watched)'
  if (status.value === 'next') return 'var(--wf-accent)'
  return 'var(--wf-border)'
})

const bgColor = computed(() => {
  if (status.value === 'watched') return 'var(--wf-watched-bg)'
  if (status.value === 'next') return 'var(--wf-next-bg)'
  return 'var(--wf-upcoming-bg)'
})

const nodeOpacity = computed(() => (status.value === 'upcoming' ? '0.55' : '1'))

// Stagger: cap at 800ms para sagas longas
const animDelay = computed(() => `${Math.min((props.data.order - 1) * 50, 800)}ms`)

</script>

<template>
  <div
    class="movie-node"
    :style="{
      borderColor: borderColor,
      background: bgColor,
      opacity: nodeOpacity,
      animationDelay: animDelay,
    }"
    :class="{ 'movie-node--next': status === 'next' }"
  >
    <!-- Handle de entrada (topo) -->
    <Handle type="target" :position="Position.Top" class="wf-handle" />

    <!-- Badge de ordem -->
    <div class="movie-node__badge" :style="{ background: borderColor }">
      {{ data.order }}
    </div>

    <!-- Pôster -->
    <div class="movie-node__poster">
      <img
        v-if="data.poster"
        :src="data.poster"
        :alt="data.title"
        class="movie-node__poster-img"
        loading="lazy"
      />
      <div v-else class="movie-node__poster-fallback">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    </div>

    <!-- Info -->
    <div class="movie-node__info">
      <p class="movie-node__title">{{ data.title }}</p>
      <p class="movie-node__year">{{ data.year }}</p>
    </div>

    <!-- Status badge -->
    <div class="movie-node__status">
      <!-- Watched -->
      <svg v-if="status === 'watched'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--wf-watched)">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <!-- Next -->
      <svg v-else-if="status === 'next'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color: var(--wf-accent)">
        <polygon points="5,3 19,12 5,21" />
      </svg>
      <!-- Upcoming -->
      <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--wf-text-faint)">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>

    <!-- Handle de saída (base) -->
    <Handle type="source" :position="Position.Bottom" class="wf-handle" />
  </div>
</template>

<style scoped>
.movie-node {
  width: 140px;
  border-radius: 12px;
  border: 2px solid;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, opacity 0.2s, transform 0.15s;
  position: relative;
  overflow: visible;
  user-select: none;
  animation: nodeEnter 0.35s ease both;
}

@keyframes nodeEnter {
  from { opacity: 0; transform: translateY(14px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

.movie-node:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.movie-node--next {
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 var(--wf-accent-glow); }
  50%       { box-shadow: 0 0 0 6px transparent; }
}

.movie-node__badge {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  z-index: 1;
  font-family: Inter, sans-serif;
}

.movie-node__poster {
  width: 100%;
  height: 180px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  background: var(--wf-bg-primary);
}

.movie-node__poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.movie-node__poster-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wf-text-faint);
}

.movie-node__info {
  padding: 8px 8px 4px;
}

.movie-node__title {
  font-size: 11px;
  font-weight: 500;
  color: var(--wf-text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  font-family: Inter, sans-serif;
}

.movie-node__year {
  font-size: 10px;
  color: var(--wf-text-muted);
  margin: 2px 0 0;
  font-family: Inter, sans-serif;
}

.movie-node__status {
  display: flex;
  justify-content: flex-end;
  padding: 2px 8px 6px;
}

.wf-handle {
  width: 8px !important;
  height: 8px !important;
  background: var(--wf-accent) !important;
  border: 2px solid var(--wf-bg-primary) !important;
}
</style>
