<script setup>
const props = defineProps({
  percent: { type: Number, default: 0 },
  watched: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  showLabel: { type: Boolean, default: true },
})

const barColor = computed(() => {
  if (props.percent === 100) return 'var(--wf-watched)'
  if (props.percent > 0) return 'var(--wf-accent)'
  return 'var(--wf-border)'
})

import { computed } from 'vue'
</script>

<template>
  <div class="w-full">
    <div class="w-full h-1.5 rounded-full overflow-hidden" style="background: var(--wf-border)">
      <div
        class="h-full rounded-full transition-all duration-500"
        :style="{ width: percent + '%', background: barColor }"
      />
    </div>
    <div v-if="showLabel" class="flex justify-between mt-1.5">
      <span class="text-xs" style="color: var(--wf-text-muted)">
        {{ watched }}/{{ total }} filmes
      </span>
      <span
        class="text-xs font-medium"
        :style="{ color: percent === 100 ? 'var(--wf-watched)' : 'var(--wf-text-muted)' }"
      >
        {{ percent }}%
        <span v-if="percent === 100"> ✓</span>
      </span>
    </div>
  </div>
</template>
