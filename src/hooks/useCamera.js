import { useCallback, useRef } from 'react'
import gsap from 'gsap'

export const MUNDO = { largura: 1000, altura: 1600 }

/**
 * Posição em tela (px) de um ponto do mundo quando a câmera está na visão geral.
 * Usado pelo overlay de hotspots (seção 6.5) — não depende de refs montadas.
 */
export function pontoParaTelaVisaoGeral(ponto) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const zoom = Math.min(vw / MUNDO.largura, vh / MUNDO.altura)
  return {
    left: vw / 2 + (ponto.x - MUNDO.largura / 2) * zoom,
    top: vh / 2 + (ponto.y - MUNDO.altura / 2) * zoom,
  }
}

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Técnica de câmera 2.5D: o "mundo" (tamanho fixo 1000x1600) é posicionado dentro do
 * viewport via transform (x, y, scale). Ver PLANO.md seção 6.
 */
export function useCamera(viewportRef, mundoRef) {
  const alvoAtual = useRef(null)

  const tela = useCallback(() => viewportRef.current.getBoundingClientRect(), [viewportRef])

  // Converte "olhar para (x, y) com zoom" em transform do mundo.
  const enquadrar = useCallback(
    ({ x, y, zoom }) => {
      const { width: vw, height: vh } = tela()
      return { x: vw / 2 - x * zoom, y: vh / 2 - y * zoom, scale: zoom }
    },
    [tela],
  )

  const visaoGeral = useCallback(() => {
    const { width: vw, height: vh } = tela()
    const zoom = Math.min(vw / MUNDO.largura, vh / MUNDO.altura)
    return { x: MUNDO.largura / 2, y: MUNDO.altura / 2, zoom }
  }, [tela])

  // Move a câmera e aplica parallax nas camadas. Retorna a timeline (chamador decide onComplete).
  const ir = useCallback(
    (alvo, { duracao = 1.2, ease = 'power3.inOut', mundo, onComplete } = {}) => {
      const el = mundo ?? mundoRef.current
      const reduzido = prefereMovimentoReduzido()
      const d = reduzido ? 0 : duracao
      alvoAtual.current = alvo

      const tl = gsap.timeline({ onComplete })
      tl.to(el, { ...enquadrar(alvo), duration: d, ease, overwrite: 'auto' }, 0)

      el.querySelectorAll('[data-profundidade]').forEach((camada) => {
        const p = parseFloat(camada.dataset.profundidade)
        tl.to(
          camada,
          {
            x: (alvo.x - MUNDO.largura / 2) * (1 - p),
            y: (alvo.y - MUNDO.altura / 2) * (1 - p),
            duration: d,
            ease,
            overwrite: 'auto',
          },
          0,
        )
      })

      return tl
    },
    [enquadrar, mundoRef],
  )

  // Chamar no resize/orientationchange.
  const reenquadrar = useCallback(() => {
    if (alvoAtual.current && mundoRef.current) {
      gsap.set(mundoRef.current, enquadrar(alvoAtual.current))
    }
  }, [enquadrar, mundoRef])

  return { ir, enquadrar, visaoGeral, reenquadrar }
}
