<script setup>
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

function startTour() {
  const allSteps = [
    {
      popover: {
        title: 'Como usar o Flow',
        description:
          'Aqui estão todos os filmes da saga em ordem. Veja como navegar e registrar seu progresso.',
      },
    },
    {
      element: '[data-tour="flow-topbar"]',
      popover: {
        title: 'Progresso da saga',
        description:
          'Veja quantos filmes você já assistiu e o percentual de conclusão em tempo real.',
        side: 'bottom',
      },
    },
    {
      element: '[data-tour="flow-save"]',
      popover: {
        title: 'Salvar a saga',
        description:
          'Clique aqui para salvar esta saga em <strong>Minhas Sagas</strong> e continuar acompanhando depois.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '[data-tour="flow-canvas"]',
      popover: {
        title: 'Os filmes da saga',
        description:
          'Cada card é um filme em ordem. O card destacado é o <strong>próximo a assistir</strong>. Clique em qualquer um para ver os detalhes.',
        side: 'top',
      },
    },
    {
      popover: {
        title: 'Painel de detalhes',
        description:
          'Ao clicar num filme, este painel abre com sinopse, elenco, avaliação e trailer.',
      },
    },
    {
      popover: {
        title: 'Marcar como assistido',
        description:
          'No painel, clique em <strong>▶ Marcar como assistido</strong>. O filme é registrado e o próximo da fila fica destacado automaticamente.',
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
  <button class="tour-btn" title="Como usar o Flow" @click="startTour">?</button>
</template>

<style scoped>
.tour-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--wf-border);
  background: var(--wf-bg-elevated);
  color: var(--wf-text-faint);
  font-size: 13px;
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
