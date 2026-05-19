<script setup>
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

function startTour() {
  const allSteps = [
    {
      popover: {
        title: 'Como registrar uma saga',
        description:
          'Sagas são coleções de filmes que você quer acompanhar. Veja como é simples adicioná-las.',
      },
    },
    {
      element: 'header a[href="/"]',
      popover: {
        title: '1. Explore franquias',
        description:
          'Clique em <strong>Explorar</strong> e pesquise qualquer coleção — Marvel, Star Wars, Matrix, Senhor dos Anéis...',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      popover: {
        title: '2. Abra o Flow',
        description:
          'Selecione a coleção nos resultados para abrir o <strong>Flow</strong> — os filmes exibidos em ordem com pôster e detalhes.',
      },
    },
    {
      popover: {
        title: '3. Salve com um clique',
        description:
          'No topo do Flow há um botão <strong>Salvar</strong>. Clique nele e a saga aparece aqui em Minhas Sagas automaticamente.',
      },
    },
    {
      element: '[data-tour="sagas-header"]',
      popover: {
        title: 'Suas sagas',
        description:
          'Cada saga salva vira um card com pôster, progresso e atalho para continuar de onde você parou.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '[data-tour="sagas-sort"]',
      popover: {
        title: 'Ordenação',
        description: 'Ordene suas sagas por data de adição, nome ou nível de progresso.',
        side: 'bottom',
      },
    },
    {
      element: '[data-tour="sagas-viewmode"]',
      popover: {
        title: 'Modo de visualização',
        description:
          'Prefere <strong>grade</strong> ou <strong>lista</strong>? Alterne aqui — sua preferência fica salva.',
        side: 'bottom',
      },
    },
  ]

  const steps = allSteps.filter(
    (step) => !step.element || document.querySelector(step.element),
  )

  const driverObj = driver({
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Próximo →',
    prevBtnText: '← Anterior',
    doneBtnText: 'Entendi!',
    steps,
  })

  driverObj.drive()
}
</script>

<template>
  <button class="tour-btn" title="Como registrar a saga" @click="startTour">?</button>
</template>

<style scoped>
.tour-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--wf-border);
  background: var(--wf-bg-elevated);
  color: var(--wf-text-faint);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    border-color 0.15s,
    color 0.15s;
}

.tour-btn:hover {
  border-color: var(--wf-accent);
  color: var(--wf-accent-light);
}
</style>
