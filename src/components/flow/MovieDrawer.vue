<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { useMovieDetails } from '@/composables/useMovieDetails'
import { useSagaStore } from '@/stores/sagaStore'

const props = defineProps({
  tmdbId: { type: Number, default: null },
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const { details, loading, error, fetch, clear } = useMovieDetails()
const store = useSagaStore()

watch(() => props.tmdbId, (id) => {
  if (id) fetch(id)
  else clear()
})

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div
      v-if="open"
      class="fixed inset-0 z-40"
      style="background: rgba(0,0,0,0.5)"
      @click="emit('close')"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <aside
      v-if="open"
      class="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
      style="width: min(420px, 100vw); background: var(--wf-bg-secondary); border-left: 1px solid var(--wf-border)"
      @click.stop
    >
      <!-- ── Loading ──────────────────────────────────────── -->
      <div
        v-if="loading"
        class="flex flex-col h-full"
      >
        <!-- skeleton backdrop -->
        <div
          class="w-full h-52 animate-pulse"
          style="background: var(--wf-bg-elevated)"
        />
        <div class="p-5 flex flex-col gap-4">
          <div
            class="h-6 w-3/4 rounded-lg animate-pulse"
            style="background: var(--wf-bg-elevated)"
          />
          <div
            class="h-4 w-1/3 rounded-lg animate-pulse"
            style="background: var(--wf-bg-elevated)"
          />
          <div class="flex flex-col gap-2 mt-2">
            <div
              class="h-3 w-full rounded animate-pulse"
              style="background: var(--wf-bg-elevated)" 
            />
            <div
              class="h-3 w-full rounded animate-pulse"
              style="background: var(--wf-bg-elevated)"
            />
            <div
              class="h-3 w-2/3 rounded animate-pulse"
              style="background: var(--wf-bg-elevated)"
            />
          </div>
        </div>
      </div>

      <!-- ── Error ───────────────────────────────────────── -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center h-full gap-3 p-6"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5" 
          style="color: 
          var(--wf-text-faint)"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <path 
            d="M12 8v4m0 4h.01"
          />
        </svg>
        <p
          class="text-sm text-center"
          style="color: var(--wf-text-muted)"
        >
          {{ error }}
        </p>
      </div>

      <!-- ── Conteúdo ─────────────────────────────────────── -->
      <template v-else-if="details">
        <!-- Backdrop -->
        <div
          class="relative flex-shrink-0"
          style="height: 210px"
        >
          <img
            v-if="details.backdrop"
            :src="details.backdrop"
            :alt="details.title"
            class="w-full h-full object-cover"
          >
          <div
            v-else
            class="w-full h-full"
            style="background: var(--wf-bg-elevated)"
          />

          <!-- Gradiente -->
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--wf-bg-secondary) 100%)"
          />

          <!-- Botão fechar -->
          <button
            class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style="background: rgba(0,0,0,0.6); color: #fff"
            aria-label="Fechar painel"
            @click="emit('close')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path 
                d="M18 6 6 18M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Status badge -->
          <div class="absolute bottom-3 left-4">
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-full"
              :style="{
                background: store.getStatus(details.id) === 'watched' ? 'var(--wf-watched-bg)' : store.getStatus(details.id) === 'next' ? 'var(--wf-next-bg)' : 'var(--wf-upcoming-bg)',
                color: store.getStatus(details.id) === 'watched' ? 'var(--wf-watched)' : store.getStatus(details.id) === 'next' ? 'var(--wf-accent-light)' : 'var(--wf-text-faint)',
                border: `1px solid currentColor`,
              }"
            >
              {{ store.getStatus(details.id) === 'watched' ? 'Assistido' : store.getStatus(details.id) === 'next' ? 'Próximo' : 'Em seguida' }}
            </span>
          </div>
        </div>

        <!-- Scroll content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-5 flex flex-col gap-5">
            <!-- Título + meta -->
            <div>
              <h2
                class="text-xl font-semibold leading-tight"
                style="color: var(--wf-text-primary)"
              >
                {{ details.title }}
              </h2>
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  class="text-sm"
                  style="color: var(--wf-text-muted)"
                >{{ details.year }}</span>
                <span
                  v-if="details.runtime"
                  class="text-sm"
                  style="color: var(--wf-text-muted)"
                >
                  {{ Math.floor(details.runtime / 60) }}h {{ details.runtime % 60 }}min
                </span>
                <span
                  v-if="details.rating"
                  class="flex items-center gap-1 text-sm font-medium"
                  style="color: #FBBF24"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon 
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    />
                  </svg>
                  {{ details.rating }}
                </span>
                <span
                  v-for="genre in details.genres"
                  :key="genre"
                  class="text-xs px-2 py-0.5 rounded-full"
                  style="background: var(--wf-bg-elevated); color: var(--wf-text-muted)"
                >
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Sinopse -->
            <div>
              <h3
                class="text-xs font-semibold uppercase tracking-wider mb-2"
                style="color: var(--wf-text-faint)"
              >
                Sinopse
              </h3>
              <p
                class="text-sm leading-relaxed"
                style="color: var(--wf-text-muted)"
              >
                {{ details.overview }}
              </p>
            </div>

            <!-- Elenco -->
            <div v-if="details.cast.length">
              <h3
                class="text-xs font-semibold uppercase tracking-wider mb-3"
                style="color: var(--wf-text-faint)"
              >
                Elenco principal
              </h3>
              <div class="flex gap-3">
                <div
                  v-for="actor in details.cast"
                  :key="actor.id"
                  class="flex flex-col items-center gap-1.5 flex-shrink-0"
                  style="width: 60px"
                >
                  <!-- Foto ou iniciais -->
                  <div
                    class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style="background: var(--wf-bg-elevated); color: var(--wf-accent-light)"
                  >
                    <img
                      v-if="actor.photo"
                      :src="actor.photo"
                      :alt="actor.name"
                      class="w-full h-full object-cover"
                    >
                    <span v-else>{{ actor.initials }}</span>
                  </div>
                  <p
                    class="text-center leading-tight"
                    style="font-size: 10px; color: var(--wf-text-muted); word-break: break-word"
                  >
                    {{ actor.name.split(' ')[0] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Botão de marcar assistido -->
            <button
              class="w-full py-3 rounded-xl text-sm font-medium transition-colors"
              :style="store.getStatus(details.id) === 'watched'
                ? 'background: var(--wf-watched-bg); color: var(--wf-watched); border: 1px solid var(--wf-watched)'
                : 'background: var(--wf-accent); color: #fff'"
              @click="store.toggleWatched(details.id)"
            >
              {{ store.getStatus(details.id) === 'watched' ? '✓ Marcar como não assistido' : '▶ Marcar como assistido' }}
            </button>

            <!-- Trailer -->
            <a
              v-if="details.trailerUrl"
              :href="details.trailerUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors"
              style="background: var(--wf-bg-elevated); color: var(--wf-text-muted); border: 1px solid var(--wf-border)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="color: #FF0000"
              >
                <path 
                  d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.3 2.8-5.3 2.7z"
                />
              </svg>
              Ver trailer no YouTube
            </a>
          </div>
        </div>
      </template>
    </aside>
  </Transition>
</template>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.drawer-enter-active, .drawer-leave-active { transition: transform 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>
