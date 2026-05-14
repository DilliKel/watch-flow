<script setup>
defineProps({
  label: { type: String, default: 'Carregando...' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <div
      class="w-8 h-8 rounded-full border-2 animate-spin"
      style="border-color: var(--wf-border); border-top-color: var(--wf-accent)"
    />
    <span class="text-sm" style="color: var(--wf-text-muted)">{{ label }}</span>
  </div>
</template>
