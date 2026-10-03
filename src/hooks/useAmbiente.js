import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const AMBIENTES = {
  1: { '--bg': '#1e222a', '--card': '#2a2f3b', '--titulo': '#fbbf24', '--texto': '#e7e5e2', '--acento': '#b45309' },
  2: { '--bg': '#3d444d', '--card': '#4a525c', '--titulo': '#67e8f9', '--texto': '#dde3e8', '--acento': '#0891b2' },
  3: { '--bg': '#f8fafc', '--card': '#f1f5f9', '--titulo': '#0e7490', '--texto': '#1e293b', '--acento': '#059669' },
}

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function aplicarAmbiente(ambiente, { animado = false } = {}) {
  const vars = AMBIENTES[ambiente]
  if (!vars) return

  if (!animado || prefereMovimentoReduzido()) {
    Object.entries(vars).forEach(([chave, valor]) => {
      document.documentElement.style.setProperty(chave, valor)
    })
    return
  }

  gsap.to(document.documentElement, { ...vars, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' })
}

/**
 * Liga cada seção (estação) da esteira à troca de tokens do ambiente correspondente
 * conforme o scroll entra/sai dela.
 * @param {{ ref: import('react').RefObject<HTMLElement>, ambiente: number }[]} secoes
 */
export function useAmbienteScroll(secoes) {
  useEffect(() => {
    const triggers = secoes
      .filter(({ ref }) => ref.current)
      .map(({ ref, ambiente }) =>
        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => aplicarAmbiente(ambiente, { animado: true }),
          onEnterBack: () => aplicarAmbiente(ambiente, { animado: true }),
        }),
      )

    return () => triggers.forEach((trigger) => trigger.kill())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secoes.length])
}
