<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'clear'])

const query = ref('')

function onInput() {
  if (query.value.trim()) {
    emit('search', query.value)
  } else {
    emit('clear')
  }
}

function onClear() {
  query.value = ''
  emit('clear')
}
</script>

<template>
  <div class="relative w-full">
    <svg
      class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
      style="color: var(--wf-text-muted)"
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>

    <input
      v-model="query"
      type="text"
      placeholder="Buscar uma saga... ex: Marvel, Star Wars, Matrix"
      autocomplete="off"
      class="w-full pl-11 pr-10 py-4 rounded-xl text-base outline-none transition-colors"
      style="
        background: var(--wf-bg-elevated);
        border: 1px solid var(--wf-border);
        color: var(--wf-text-primary);
        font-family: Inter, sans-serif;
      "
      @input="onInput"
      @focus="$event.target.style.borderColor = 'var(--wf-accent)'"
      @blur="$event.target.style.borderColor = 'var(--wf-border)'"
    />

    <button
      v-if="query"
      class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
      style="color: var(--wf-text-muted)"
      aria-label="Limpar busca"
      @click="onClear"
      @mouseenter="$event.target.style.color = 'var(--wf-text-primary)'"
      @mouseleave="$event.target.style.color = 'var(--wf-text-muted)'"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
