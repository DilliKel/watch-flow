<script setup>
import { getPosterUrl } from '@/services/tmdb'

defineProps({
  results: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="w-full mt-3">
    <!-- Loading skeletons -->
    <div v-if="loading" class="flex flex-col gap-2">
      <div
        v-for="n in 4"
        :key="n"
        class="h-16 rounded-xl animate-pulse"
        style="background: var(--wf-bg-elevated)"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      style="background: var(--wf-bg-elevated); color: #F87171; border: 1px solid #3F1F1F"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
      </svg>
      {{ error }}
    </div>

    <!-- Results -->
    <div v-else-if="results.length" class="flex flex-col gap-1.5">
      <button
        v-for="item in results"
        :key="item.id"
        class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors group"
        style="background: var(--wf-bg-elevated); border: 1px solid var(--wf-border)"
        @click="emit('select', item)"
        @mouseenter="$event.currentTarget.style.borderColor = 'var(--wf-border-accent)'"
        @mouseleave="$event.currentTarget.style.borderColor = 'var(--wf-border)'"
      >
        <!-- Poster -->
        <div
          class="flex-shrink-0 w-9 h-14 rounded overflow-hidden"
          style="background: var(--wf-bg-primary)"
        >
          <img
            v-if="getPosterUrl(item.poster)"
            :src="getPosterUrl(item.poster, 'w92')"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--wf-text-faint)">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium truncate"
            style="color: var(--wf-text-primary)"
          >
            {{ item.name }}
          </p>
          <p class="text-xs mt-0.5" style="color: var(--wf-text-muted)">
            {{ item.type === 'collection' ? 'Coleção' : 'Filme' }}
          </p>
        </div>

        <!-- Arrow -->
        <svg
          class="flex-shrink-0 transition-transform group-hover:translate-x-0.5"
          style="color: var(--wf-text-faint)"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>
