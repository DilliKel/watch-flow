# WatchFlow — Mapa Completo do Projeto

> Visualizador de sagas de filmes e séries usando Vue 3 + VueFlow + TMDB API  
> Objetivo: portfólio pessoal com demonstração real de domínio do VueFlow

---

## Visão Geral

| Item | Detalhe |
|------|---------|
| Nome | WatchFlow |
| Tipo | SPA (Single Page Application) |
| Repositório sugerido | `github.com/DilliKel/watchflow` |
| Deploy sugerido | Netlify |
| API externa | [TMDB — The Movie Database](https://www.themoviedb.org/settings/api) |
| Licença sugerida | MIT |

---

## Tech Stack Completa

| Camada | Tecnologia | Versão mínima | Motivo |
|--------|-----------|--------------|--------|
| Framework | Vue 3 | 3.4+ | Composition API, `<script setup>` |
| Build tool | Vite | 5.0+ | HMR rápido, config simples |
| Flow engine | VueFlow | 1.4+ | Nós customizados, mini-mapa, pan/zoom |
| Estado global | Pinia | 2.1+ | Leve, integra bem com Vue 3 |
| Roteamento | Vue Router | 4.3+ | Navegação home ↔ flow ↔ my sagas |
| Estilo | TailwindCSS | 3.4+ | Utilitário, fácil de manter |
| HTTP client | fetch nativo | — | Sem dependência extra pra TMDB |
| Persistência | localStorage | — | Salvar progresso sem backend |
| Ícones | Heroicons ou Lucide Vue | — | SVG, tree-shakeable |
| Linting | ESLint + Prettier | — | Código limpo no portfólio |

---

## Paleta de Cores

### Base do design system

```css
:root {
  /* Backgrounds */
  --wf-bg-primary:    #0D0D0F;   /* fundo principal — quase preto */
  --wf-bg-secondary:  #141417;   /* superfícies de cards */
  --wf-bg-elevated:   #1C1C21;   /* modais, dropdowns */

  /* Texto */
  --wf-text-primary:  #F2F2F5;   /* títulos e textos principais */
  --wf-text-muted:    #8A8A9A;   /* labels, placeholders */
  --wf-text-faint:    #4A4A5A;   /* bordas com texto, hints */

  /* Acento principal — roxo cinema */
  --wf-accent:        #7C5CBF;   /* botões primários, handles do VueFlow */
  --wf-accent-light:  #A47FE0;   /* hover states */
  --wf-accent-glow:   #7C5CBF33; /* sombra suave / glow */

  /* Status dos nós */
  --wf-watched:       #22C97A;   /* verde — assistido */
  --wf-watched-bg:    #0D2B1F;   /* fundo do nó assistido */
  --wf-next:          #7C5CBF;   /* roxo — próximo a assistir */
  --wf-next-bg:       #1A1230;   /* fundo do nó próximo */
  --wf-upcoming:      #3A3A45;   /* cinza — ainda não desbloqueado */
  --wf-upcoming-bg:   #141417;   /* fundo do nó bloqueado */

  /* Arestas do VueFlow */
  --wf-edge-default:  #3A3A45;
  --wf-edge-active:   #7C5CBF;

  /* Bordas */
  --wf-border:        #2A2A35;
  --wf-border-accent: #7C5CBF55;
}
```

### Referência visual dos nós

| Estado | Borda | Background | Ícone |
|--------|-------|-----------|-------|
| Assistido | `#22C97A` | `#0D2B1F` | ✓ check verde |
| Próximo | `#7C5CBF` | `#1A1230` | ▶ play roxo (pulsa) |
| Em seguida | `#3A3A45` | `#141417` | 🔒 cinza apagado |

### Tipografia

| Uso | Fonte | Peso | Tamanho |
|-----|-------|------|---------|
| Logo "WatchFlow" | `Bebas Neue` (Google Fonts) | 400 | 28px |
| Títulos de tela | `Inter` | 600 | 20–24px |
| Corpo / labels | `Inter` | 400 | 13–15px |
| Título do nó | `Inter` | 500 | 12px |
| Ano / metadata | `Inter` | 400 | 11px, muted |

---

## Estrutura de Pastas

```
watchflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── flow/
│   │   │   ├── MovieNode.vue        ← nó customizado do VueFlow
│   │   │   ├── FlowCanvas.vue       ← wrapper do VueFlow com config
│   │   │   └── FlowMiniMap.vue      ← mini-mapa customizado
│   │   ├── search/
│   │   │   ├── SearchBar.vue
│   │   │   └── SearchResults.vue
│   │   ├── saga/
│   │   │   ├── SagaCard.vue         ← card na tela "minhas sagas"
│   │   │   └── SagaProgressBar.vue
│   │   └── ui/
│   │       ├── AppHeader.vue
│   │       ├── BaseButton.vue
│   │       └── LoadingSpinner.vue
│   ├── composables/
│   │   ├── useTMDB.js               ← todas as chamadas à API
│   │   ├── useFlowBuilder.js        ← converte dados TMDB → nós/arestas
│   │   └── useProgress.js           ← leitura/escrita de progresso
│   ├── stores/
│   │   ├── sagaStore.js             ← sagas salvas + progresso
│   │   └── searchStore.js           ← estado da busca
│   ├── views/
│   │   ├── HomeView.vue             ← busca + resultados
│   │   ├── FlowView.vue             ← tela principal do VueFlow
│   │   └── MySagasView.vue          ← painel pessoal
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   └── tmdb.js                  ← funções de fetch à TMDB API
│   ├── utils/
│   │   └── flowLayout.js            ← algoritmo de posicionamento dos nós
│   ├── App.vue
│   └── main.js
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Variáveis de Ambiente

```bash
# .env.example — renomear para .env.local
VITE_TMDB_API_KEY=sua_chave_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w300
```

> ⚠️ Nunca commitar o `.env.local`. Já está no `.gitignore` por padrão no Vite.

---

## TMDB API — Endpoints utilizados

| Endpoint | Método | Para quê |
|----------|--------|---------|
| `/search/collection` | GET | Buscar sagas pelo nome |
| `/collection/{id}` | GET | Buscar filmes de uma coleção com ordem |
| `/search/movie` | GET | Fallback se não for coleção |
| `/configuration` | GET | Obter base URL das imagens |

### Exemplo de chamada

```js
// src/services/tmdb.js
const BASE = import.meta.env.VITE_TMDB_BASE_URL
const KEY  = import.meta.env.VITE_TMDB_API_KEY

export async function searchCollections(query) {
  const res = await fetch(`${BASE}/search/collection?api_key=${KEY}&query=${encodeURIComponent(query)}&language=pt-BR`)
  const data = await res.json()
  return data.results
}

export async function getCollection(id) {
  const res = await fetch(`${BASE}/collection/${id}?api_key=${KEY}&language=pt-BR`)
  return res.json()
}
```

---

## VueFlow — Conceitos que serão usados

| Recurso | Onde | Por quê |
|---------|------|---------|
| Custom nodes | `MovieNode.vue` | Pôster + título + status |
| Node types | `FlowCanvas.vue` | Registrar `MovieNode` como tipo `movie` |
| Handles | `MovieNode.vue` | Pontos de entrada/saída das arestas |
| Edge labels | `useFlowBuilder.js` | Mostrar número do episódio / ordem |
| MiniMap | `FlowMiniMap.vue` | Navegação em sagas grandes |
| `useVueFlow()` | `FlowView.vue` | fitView, zoomTo, getNodes |
| `fitView()` | Após carregar saga | Centralizar o "próximo" nó |
| `onNodeClick` | `FlowCanvas.vue` | Abrir painel lateral do filme |

### Estrutura de um nó no VueFlow

```js
// gerado em useFlowBuilder.js
{
  id: String(movie.id),
  type: 'movie',          // aponta pra MovieNode.vue
  position: { x, y },    // calculado pelo flowLayout.js
  data: {
    title: movie.title,
    year: movie.release_date?.slice(0, 4),
    poster: `${IMAGE_BASE}${movie.poster_path}`,
    tmdbId: movie.id,
    order: index + 1,
    status: 'upcoming'    // 'watched' | 'next' | 'upcoming'
  }
}
```

### Estrutura de uma aresta

```js
{
  id: `e-${sourceId}-${targetId}`,
  source: String(sourceId),
  target: String(targetId),
  animated: true,
  style: { stroke: 'var(--wf-edge-default)' }
}
```

---

## Algoritmo de Layout dos Nós

Sagas são lineares, então o layout é simples — filmes em fila horizontal com quebra de linha a cada N itens:

```js
// src/utils/flowLayout.js
const COLS     = 4     // filmes por linha
const NODE_W   = 160   // largura do nó
const NODE_H   = 240   // altura do nó
const GAP_X    = 60    // espaço horizontal entre nós
const GAP_Y    = 80    // espaço vertical entre linhas

export function buildLayout(movies) {
  return movies.map((movie, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
      x: col * (NODE_W + GAP_X),
      y: row * (NODE_H + GAP_Y)
    }
  })
}
```

---

## Persistência — Estrutura do localStorage

```js
// Chave: 'watchflow_data'
{
  "sagas": {
    "131295": {                   // ID da coleção TMDB
      "name": "Marvel Cinematic Universe",
      "poster": "/abc123.jpg",
      "totalMovies": 33,
      "savedAt": "2025-05-13T10:00:00Z",
      "watched": [299536, 299534, 284053]  // IDs dos filmes assistidos
    }
  }
}
```

---

## Sprints

---

### 🚀 Sprint 1 — Base do projeto
**Duração estimada:** 1–2 dias  
**Objetivo:** projeto rodando localmente com VueFlow renderizando um nó mockado

#### Tarefas

- [ ] Criar projeto com Vite: `npm create vite@latest watchflow -- --template vue`
- [ ] Instalar dependências base:
  ```bash
  npm install @vue-flow/core @vue-flow/minimap @vue-flow/controls
  npm install pinia vue-router@4
  npm install -D tailwindcss postcss autoprefixer
  npm install -D eslint prettier eslint-plugin-vue
  npx tailwindcss init -p
  ```
- [ ] Configurar Tailwind (`tailwind.config.js` com `content` apontando pra `./src/**`)
- [ ] Configurar Vue Router com 3 rotas: `/`, `/flow/:id`, `/my-sagas`
- [ ] Configurar Pinia no `main.js`
- [ ] Criar `AppHeader.vue` com logo e link pras rotas
- [ ] Criar `FlowCanvas.vue` com `<VueFlow>` básico e 1 nó mockado
- [ ] Confirmar que o VueFlow renderiza no browser
- [ ] Criar `.env.local` com a API key da TMDB
- [ ] Commitar: `chore: project setup`

#### Requisitos para começar
- Node.js 18+ instalado
- Conta criada na TMDB com API key em mãos
- VSCode com extensões: Volar (Vue), Tailwind IntelliSense, ESLint

#### Entregável
`/` abre com header, `/flow/teste` mostra o VueFlow com 1 nó no centro

---

### 🔍 Sprint 2 — Integração com TMDB
**Duração estimada:** 2–3 dias  
**Objetivo:** buscar sagas reais e exibir os filmes como nós no VueFlow

#### Tarefas

- [ ] Criar `src/services/tmdb.js` com funções `searchCollections` e `getCollection`
- [ ] Criar `src/composables/useTMDB.js` com estado de loading, erro e resultados
- [ ] Criar `SearchBar.vue` com debounce de 400ms na digitação
- [ ] Criar `SearchResults.vue` listando coleções com pôster e nome
- [ ] Ao clicar numa coleção, navegar pra `/flow/:id`
- [ ] Em `FlowView.vue`, chamar `getCollection(id)` ao montar
- [ ] Criar `src/utils/flowLayout.js` com `buildLayout()`
- [ ] Criar `src/composables/useFlowBuilder.js` que converte resposta da TMDB em array de nós e arestas
- [ ] Renderizar os nós reais no `FlowCanvas.vue`
- [ ] Testar com: MCU, Star Wars, O Senhor dos Anéis, Matrix

#### Requisitos
- Sprint 1 concluída
- API key válida no `.env.local`
- Familiaridade com `fetch` e `async/await`

#### Atenção
- TMDB retorna filmes em `collection.parts` — já vem ordenado por `release_date`, mas valide
- Imagens têm base URL separada: `https://image.tmdb.org/t/p/w300{poster_path}`
- Adicionar tratamento de erro se a coleção não tiver imagem

#### Entregável
Digitar "Marvel" → ver lista de coleções → clicar → VueFlow mostra os filmes conectados em ordem

---

### 🎨 Sprint 3 — Nó customizado (MovieNode)
**Duração estimada:** 2–3 dias  
**Objetivo:** nós visuais com pôster, título, ano e status de "assistido"

#### Tarefas

- [ ] Criar `MovieNode.vue` como custom node do VueFlow:
  - Pôster do filme (img com fallback se não tiver)
  - Título truncado (max 2 linhas)
  - Ano de lançamento
  - Badge de ordem (nº 1, 2, 3...)
  - Indicador visual de status (borda colorida)
- [ ] Registrar `MovieNode` no `FlowCanvas.vue`:
  ```js
  const nodeTypes = { movie: markRaw(MovieNode) }
  ```
- [ ] Criar store `sagaStore.js` no Pinia com:
  - `watchedIds`: Set de IDs assistidos
  - `toggleWatched(id)`: marcar/desmarcar
  - `getStatus(id)`: retorna `'watched' | 'next' | 'upcoming'`
- [ ] Ao clicar no nó, chamar `toggleWatched`
- [ ] Lógica de status: `next` = primeiro filme não assistido em sequência
- [ ] Aplicar estilos por status usando a paleta definida
- [ ] Adicionar `MiniMap` do VueFlow no canto inferior direito
- [ ] Ao carregar o flow, dar `fitView()` e depois zoom no nó `next`

#### Requisitos
- Sprint 2 concluída
- Entender como registrar `nodeTypes` no VueFlow
- Estudar a prop `data` dos nós customizados na doc do VueFlow

#### Atenção
- Usar `markRaw()` ao registrar o componente como tipo de nó — obrigatório no VueFlow
- O Handle de saída fica no bottom do nó e o de entrada no top
- Nós com status `upcoming` podem ter `opacity: 0.5` pra dar sensação de "bloqueado"

#### Entregável
Nós com pôster real, status visual funcionando, clicar marca como assistido e atualiza o próximo

---

### 💾 Sprint 4 — Persistência e painel pessoal
**Duração estimada:** 1–2 dias  
**Objetivo:** progresso salvo no localStorage + tela "Minhas Sagas"

#### Tarefas

- [ ] No `sagaStore.js`, adicionar:
  - `savedSagas`: mapa de sagas salvas com metadados
  - `saveSaga(collection)`: salva a saga ao abrir o flow
  - `getProgress(sagaId)`: retorna `{ watched, total, percent }`
- [ ] Criar `src/composables/useProgress.js`:
  - `saveToStorage(data)`: persiste no localStorage
  - `loadFromStorage()`: carrega ao iniciar o app
  - Chamar `loadFromStorage()` no `App.vue` (onMounted)
- [ ] Criar `MySagasView.vue`:
  - Grid de `SagaCard.vue` com pôster, nome e barra de progresso
  - Botão "Continuar" que navega pro flow da saga
  - Botão "Remover" que apaga do localStorage
- [ ] Criar `SagaCard.vue` com visual limpo
- [ ] Criar `SagaProgressBar.vue` (barra colorida com percentual)
- [ ] Estado vazio quando não há sagas salvas (ilustração + CTA pra buscar)
- [ ] Testar fluxo completo: buscar → assistir alguns → fechar → reabrir → progresso mantido

#### Requisitos
- Sprint 3 concluída
- Entender como Pinia persiste estado manualmente no localStorage

#### Entregável
Fechar e reabrir o app mantém todo o progresso. Tela "Minhas Sagas" lista tudo salvo com barra de progresso

---

### ✨ Sprint 5 — Polimento e deploy
**Duração estimada:** 2–3 dias  
**Objetivo:** app pronto para o portfólio — bonito, sem bugs, online

#### Tarefas

**Visual**
- [ ] Refinar tipografia com `Bebas Neue` pra logo e `Inter` pro resto (Google Fonts)
- [ ] Aplicar paleta de cores completa em todos os componentes
- [ ] Animação de entrada dos nós ao carregar o flow (`opacity 0 → 1` com stagger)
- [ ] Aresta animada (já vem no VueFlow com `animated: true`)
- [ ] Loading skeleton enquanto a TMDB responde
- [ ] Transições de rota suaves com `<Transition>`
- [ ] Responsividade básica (mobile pode mostrar lista em vez do flow)

**Qualidade**
- [ ] Tratamento de erro em todas as chamadas à API (tela de erro amigável)
- [ ] Caso a saga não tenha coleção na TMDB (busca por filme diretamente)
- [ ] Teste manual nos fluxos: MCU, Star Wars, LOTR, Godfather, Matrix, Fast & Furious
- [ ] Revisar acessibilidade: `alt` nas imagens, `aria-label` nos botões de ação
- [ ] Rodar `eslint --fix` e resolver todos os warnings

**Deploy**
- [ ] Criar repositório público no GitHub
- [ ] Criar conta na Vercel (gratuita)
- [ ] Conectar repo → Vercel faz deploy automático
- [ ] Adicionar `VITE_TMDB_API_KEY` nas variáveis de ambiente da Vercel
- [ ] Testar a URL pública
- [ ] Adicionar `README.md` com screenshots e link do demo

#### Entregável
App online com URL pública, README com demo GIF, pronto pra colocar no portfólio/currículo

---

## Resumo dos Sprints

| Sprint | Foco | Duração | Resultado |
|--------|------|---------|-----------|
| 1 | Setup + VueFlow básico | 1–2 dias | Projeto rodando localmente |
| 2 | Integração TMDB | 2–3 dias | Sagas reais renderizadas |
| 3 | Nó customizado + status | 2–3 dias | Visual completo, marcar assistido |
| 4 | Persistência + My Sagas | 1–2 dias | Progresso salvo, painel pessoal |
| 5 | Polimento + deploy | 2–3 dias | App online no portfólio |
| **Total** | | **~10–14 dias** | |

---

## Dependências do package.json

```json
{
  "name": "watchflow",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --fix"
  },
  "dependencies": {
    "@vue-flow/controls": "^1.1.1",
    "@vue-flow/core": "^1.41.2",
    "@vue-flow/minimap": "^1.3.2",
    "pinia": "^2.1.7",
    "vue": "^3.4.0",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-vue": "^9.24.0",
    "postcss": "^8.4.38",
    "prettier": "^3.2.5",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  }
}
```

---

## Checklist de Qualidade (antes do deploy)

- [ ] Nenhuma API key hardcoded no código
- [ ] `.env.local` no `.gitignore`
- [ ] Todas as imagens têm `alt`
- [ ] Sem `console.log` esquecido
- [ ] Loading state em todas as chamadas assíncronas
- [ ] Erro tratado se TMDB estiver fora
- [ ] Testado no Chrome, Firefox e Safari
- [ ] README com: descrição, stack, como rodar localmente, link do demo

---

## Recursos úteis

| Recurso | Link |
|---------|------|
| VueFlow docs | https://vueflow.dev/guide/ |
| VueFlow exemplos | https://vueflow.dev/examples/ |
| TMDB API docs | https://developer.themoviedb.org/docs |
| TMDB collections endpoint | https://developer.themoviedb.org/reference/collection-details |
| Pinia docs | https://pinia.vuejs.org |
| Vue Router docs | https://router.vuejs.org |
| Bebas Neue (Google Fonts) | https://fonts.google.com/specimen/Bebas+Neue |
| Heroicons (ícones) | https://heroicons.com |
| Vercel deploy | https://vercel.com/new |

---

*WatchFlow — feito por você, pra você assistir do jeito certo* 🎬