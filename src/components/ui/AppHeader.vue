<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="flex items-center justify-between px-6 py-3 border-b border-[var(--wf-border)] bg-[var(--wf-bg-secondary)]">
    <RouterLink to="/" class="flex items-center gap-2 no-underline">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#0D0D0F"/>
        <circle cx="16" cy="16" r="10" stroke="#7C5CBF" stroke-width="2"/>
        <polygon points="13,11 13,21 22,16" fill="#7C5CBF"/>
      </svg>
      <span class="font-display text-[28px] leading-none text-[var(--wf-text-primary)] tracking-wide">
        WATCHFLOW
      </span>
    </RouterLink>

    <nav class="flex items-center gap-1">
      <RouterLink
        to="/"
        class="nav-link"
        :class="{ 'nav-link--active': $route.name === 'home' }"
      >
        Explorar
      </RouterLink>
      <RouterLink
        to="/my-sagas"
        class="nav-link"
        :class="{ 'nav-link--active': $route.name === 'my-sagas' }"
      >
        Minhas Sagas
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.nav-link {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--wf-text-muted);
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
}

.nav-link:hover {
  color: var(--wf-text-primary);
  background-color: var(--wf-bg-elevated);
}

.nav-link--active {
  color: var(--wf-accent-light);
  background-color: var(--wf-accent-glow);
}
</style>
