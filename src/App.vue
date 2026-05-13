<script setup>
import AppHeader from '@/components/ui/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--wf-bg-primary)]">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>