import gsap from 'gsap'

/**
 * Anima um painel (card ou quiz) "nascendo" da posição do hotspot tocado até o centro da tela.
 * Ver PLANO.md seção 6.4. `origem` é o DOMRect do botão do hotspot capturado no toque.
 */
export function abrirPainel(origem, painelEl) {
  if (!painelEl) return gsap.timeline()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return gsap.fromTo(painelEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
  }

  if (!origem) {
    return gsap.fromTo(
      painelEl,
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
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
      autoAlpha: 0,
    },
    { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
  )
}

/** Fecha o painel com uma saída curta e dispara o callback ao terminar. */
export function fecharPainel(painelEl, aoTerminar) {
  if (!painelEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    aoTerminar()
    return
  }
  gsap.to(painelEl, { autoAlpha: 0, scale: 0.92, duration: 0.25, ease: 'power2.in', onComplete: aoTerminar })
}
