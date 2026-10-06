import gsap from 'gsap'

function reduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Anima um painel (card ou quiz) "nascendo" da posição do hotspot tocado até o
 * centro da tela. Ver PLANO.md seção 6.4. `origem` é o DOMRect do botão do
 * hotspot, capturado no momento do toque.
 */
export function abrirPainel(origem, painelEl) {
  if (!painelEl) return gsap.timeline()

  if (reduzido()) {
    return gsap.fromTo(painelEl, { opacity: 0 }, { opacity: 1, duration: 0.01 })
  }

  if (!origem) {
    return gsap.fromTo(
      painelEl,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
    )
  }

  const c = painelEl.getBoundingClientRect()
  const origemCentroX = origem.left + origem.width / 2
  const origemCentroY = origem.top + origem.height / 2
  const painelCentroX = c.left + c.width / 2
  const painelCentroY = c.top + c.height / 2

  return gsap.fromTo(
    painelEl,
    {
      x: origemCentroX - painelCentroX,
      y: origemCentroY - painelCentroY,
      scale: Math.min(1, Math.max(origem.width / c.width, 0.1)),
      opacity: 0,
    },
    { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' },
  )
}

/** Fecha o painel com uma saída curta e dispara o callback ao terminar. */
export function fecharPainel(painelEl, aoTerminar) {
  if (!painelEl || reduzido()) {
    aoTerminar()
    return
  }
  gsap.to(painelEl, { opacity: 0, scale: 0.92, duration: 0.25, ease: 'power2.in', onComplete: aoTerminar })
}

/**
 * Transição entre dois mundos: pan até a saída, zoom forte ATRAVÉS dela enquanto
 * a cena atual some, e a próxima entra vinda de uma escala menor.
 * Ver PLANO.md seção 6.6 (a referência é a transição de Gorogoa).
 *
 * `enquadrar` e `visaoGeral` vêm do useCamera; `saida` é { x, y, zoom }.
 * Com `prefers-reduced-motion` vira um crossfade simples.
 */
export function transicaoEntreCenas({ enquadrar, visaoGeral, mundoAtual, mundoProximo, saida, aoTerminar }) {
  if (!mundoAtual || !mundoProximo) {
    aoTerminar?.()
    return gsap.timeline()
  }

  const geral = visaoGeral()

  if (reduzido()) {
    gsap.set(mundoProximo, { ...enquadrar(geral), autoAlpha: 0 })
    return gsap
      .timeline({ onComplete: aoTerminar })
      .to(mundoAtual, { autoAlpha: 0, duration: 0.2 }, 0)
      .to(mundoProximo, { autoAlpha: 1, duration: 0.2 }, 0)
  }

  const tl = gsap.timeline({ onComplete: aoTerminar })

  // 1. pan até a saída
  tl.to(mundoAtual, { ...enquadrar(saida), duration: 0.8, ease: 'power2.inOut' }, 0)
    // 2. zoom através da saída, acelerando
    .to(
      mundoAtual,
      { ...enquadrar({ ...saida, zoom: saida.zoom * 4 }), duration: 0.7, ease: 'power2.in' },
      '>-0.05',
    )
    .to(mundoAtual, { autoAlpha: 0, duration: 0.25 }, '>-0.25')
    // 3. a próxima cena chega, vinda de uma escala menor
    .fromTo(
      mundoProximo,
      { ...enquadrar({ ...geral, zoom: geral.zoom * 0.62 }), autoAlpha: 0 },
      { ...enquadrar(geral), autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
      '>-0.15',
    )

  return tl
}

/** O portão da fachada enrolando para cima antes do mergulho para a Sala 1. */
export function abrirPortao(portaoEl) {
  if (!portaoEl) return gsap.timeline()
  if (reduzido()) {
    gsap.set(portaoEl, { scaleY: 0, autoAlpha: 0 })
    return gsap.timeline()
  }
  return gsap.to(portaoEl, { scaleY: 0, duration: 0.55, ease: 'power2.inOut', transformOrigin: '50% 0%' })
}
