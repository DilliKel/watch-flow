<div align="center">

# 🎬 WatchFlow

**Visualize e acompanhe suas sagas de filmes como um grafo interativo**

[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![VueFlow](https://img.shields.io/badge/VueFlow-1.41-7C5CBF?style=flat-square)](https://vueflow.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=flat-square)](https://www.themoviedb.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Demo ao vivo](#) · [Reportar bug](../../issues) · [Sugerir feature](../../issues)

</div>

---

## ✨ O que é o WatchFlow?

WatchFlow transforma sagas de filmes em **grafos interativos navegáveis**. Busque uma franquia (Marvel, Star Wars, Senhor dos Anéis…), visualize todos os filmes conectados em ordem cronológica e acompanhe o que você já assistiu — tudo salvo automaticamente no seu browser.

É um projeto de portfólio construído para demonstrar domínio do **VueFlow** integrado a dados reais da **TMDB API**.

---

## 🖥️ Demo

> _Screenshots e GIF do fluxo completo serão adicionados após o deploy_

<!-- Substitua pelos screenshots reais após o deploy -->
| Tela inicial | Flow da saga |
|:---:|:---:|
| ![Home](docs/screenshot-home.png) | ![Flow](docs/screenshot-flow.png) |

---

## 🚀 Funcionalidades

- 🔍 **Busca em tempo real** com debounce de 400ms contra a TMDB API
- 🗺️ **Grafo interativo** com pan, zoom, minimap e controles de navegação
- 🎴 **Nós com pôster real** — imagem, título, ano e número de ordem
- 🟢 **Sistema de status visual** — `assistido` / `próximo` / `em seguida`
- 💜 **Animação de pulso** no próximo filme a assistir
- 🎯 **Zoom automático** no próximo filme após cada ação
- 💾 **Progresso salvo** automaticamente no localStorage
- 📋 **Tela "Minhas Sagas"** com barra de progresso de cada franquia
- 📱 Responsivo — funciona no mobile com lista simplificada

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Framework | Vue 3 + `<script setup>` | Composition API moderna e reativa |
| Build | Vite 5 | HMR ultrarrápido |
| Grafos | **VueFlow 1.41** | Nós customizados, pan/zoom, minimap |
| Estado | Pinia | Store leve e tipável |
| Roteamento | Vue Router 4 | SPA com rotas dinâmicas |
| Estilo | TailwindCSS + CSS custom | Utilitário + design system próprio |
| API | TMDB (fetch nativo) | Dados reais de sagas e pôsteres |
| Persistência | localStorage | Progresso sem backend |

---

## ⚡ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Uma API key gratuita da [TMDB](https://www.themoviedb.org/settings/api)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/DilliKel/watchflow.git
cd watchflow

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e adicione sua VITE_TMDB_API_KEY

# Suba o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` e está pronto. 🎉

### Variáveis de ambiente

```bash
# .env.local
VITE_TMDB_API_KEY=sua_chave_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w300
```

> ⚠️ Nunca commite o `.env.local`. Ele já está no `.gitignore`.

---

## 📁 Estrutura do projeto

```
src/
├── assets/
│   └── main.css              # Design system (variáveis CSS + Tailwind)
├── components/
│   ├── flow/
│   │   ├── FlowCanvas.vue    # Wrapper do VueFlow com nodeTypes e zoom
│   │   └── MovieNode.vue     # Nó customizado: pôster, status, badge
│   ├── search/
│   │   ├── SearchBar.vue     # Input com debounce
│   │   └── SearchResults.vue # Lista com skeleton e tratamento de erro
│   └── ui/
│       └── AppHeader.vue     # Logo + navegação
├── composables/
│   ├── useTMDB.js            # Busca com loading/erro/debounce
│   └── useFlowBuilder.js     # Converte resposta TMDB → nodes + edges
├── services/
│   └── tmdb.js               # Funções de fetch à TMDB API
├── stores/
│   └── sagaStore.js          # Progresso, status watched/next/upcoming
├── utils/
│   └── flowLayout.js         # Algoritmo de posicionamento dos nós
├── views/
│   ├── HomeView.vue          # Busca + resultados + sugestões
│   ├── FlowView.vue          # Tela principal do grafo + barra de progresso
│   └── MySagasView.vue       # Painel pessoal com todas as sagas salvas
└── router/
    └── index.js              # Rotas: /, /flow/:id, /my-sagas
```

---

## 🎨 Design System

O projeto usa uma paleta própria inspirada em interfaces de cinema:

| Token | Cor | Uso |
|-------|-----|-----|
| `--wf-accent` | `#7C5CBF` | Botões, handles, nó "próximo" |
| `--wf-watched` | `#22C97A` | Nós assistidos |
| `--wf-bg-primary` | `#0D0D0F` | Fundo principal |
| `--wf-bg-elevated` | `#1C1C21` | Cards e modais |

Tipografia: **Bebas Neue** para o logotipo · **Inter** para o restante

---

## 🗺️ Roadmap

- [x] **Sprint 1** — Setup base, VueFlow funcionando
- [x] **Sprint 2** — Integração com TMDB API
- [x] **Sprint 3** — Nós customizados com status visual
- [ ] **Sprint 4** — Tela "Minhas Sagas" + persistência completa
- [ ] **Sprint 5** — Polimento visual, animações e deploy

---

## 📜 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais detalhes.

---

<div align="center">

[VueFlow](https://vueflow.dev) + [TMDB API](https://www.themoviedb.org)

</div>
