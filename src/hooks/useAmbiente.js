import gsap from 'gsap'

export const AMBIENTES = {
  1: { '--bg': '#1e222a', '--card': '#2a2f3b', '--titulo': '#fbbf24', '--texto': '#e7e5e2', '--acento': '#b45309' },
  2: { '--bg': '#3d444d', '--card': '#4a525c', '--titulo': '#67e8f9', '--texto': '#dde3e8', '--acento': '#0891b2' },
  3: { '--bg': '#f8fafc', '--card': '#f1f5f9', '--titulo': '#0e7490', '--texto': '#1e293b', '--acento': '#059669' },
}

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Aplica os tokens de cor do ambiente da estação. Chamado a cada troca de sala. */
export function aplicarAmbiente(ambiente, { animado = false } = {}) {
  const vars = AMBIENTES[ambiente]
  if (!vars) return

  if (!animado || prefereMovimentoReduzido()) {
    Object.entries(vars).forEach(([chave, valor]) => {
      document.documentElement.style.setProperty(chave, valor)
    })
    return
  }

  gsap.to(document.documentElement, { ...vars, duration: 0.5, ease: 'power1.inOut', overwrite: 'auto' })
}
