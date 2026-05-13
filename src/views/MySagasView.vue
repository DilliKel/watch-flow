<script setup>
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6">
    <svg
      class="text-[var(--wf-text-faint)] mb-6"
      width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
    <h2 class="text-xl font-semibold text-[var(--wf-text-primary)] mb-2">
      Nenhuma saga salva ainda
    </h2>
    <p class="text-[var(--wf-text-muted)] text-sm mb-6 text-center max-w-xs">
      Busque uma saga na tela inicial e comece a acompanhar seu progresso.
    </p>
    <RouterLink
      to="/"
      class="px-5 py-2.5 bg-[var(--wf-accent)] hover:bg-[var(--wf-accent-light)] text-white text-sm font-medium rounded-lg transition-colors"
    >
      Explorar sagas
    </RouterLink>
  </div>
</template>
