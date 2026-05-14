<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost | danger
  size: { type: String, default: 'md' },          // sm | md | lg
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :disabled="disabled"
    class="base-btn"
    :class="[`base-btn--${variant}`, `base-btn--${size}`, { 'base-btn--disabled': disabled }]"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  white-space: nowrap;
}

.base-btn--sm  { font-size: 12px; padding: 5px 12px; }
.base-btn--md  { font-size: 13px; padding: 8px 16px; }
.base-btn--lg  { font-size: 15px; padding: 11px 22px; }

.base-btn--primary   { background: var(--wf-accent); color: #fff; }
.base-btn--primary:hover:not(:disabled)   { background: var(--wf-accent-light); }

.base-btn--secondary {
  background: var(--wf-bg-elevated);
  color: var(--wf-text-muted);
  border: 1px solid var(--wf-border);
}
.base-btn--secondary:hover:not(:disabled) {
  color: var(--wf-text-primary);
  border-color: var(--wf-border-accent);
}

.base-btn--ghost { background: transparent; color: var(--wf-text-muted); }
.base-btn--ghost:hover:not(:disabled) { color: var(--wf-text-primary); background: var(--wf-bg-elevated); }

.base-btn--danger { background: var(--wf-bg-elevated); color: #F87171; border: 1px solid var(--wf-border); }
.base-btn--danger:hover:not(:disabled) { background: #1F1010; border-color: #3F1F1F; }

.base-btn--disabled { opacity: 0.45; cursor: not-allowed; }
</style>
