<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import { useProgress } from '@/composables/useProgress'

const { loadFromStorage } = useProgress()
onMounted(() => loadFromStorage())
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--wf-bg-primary)">
    <AppHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
