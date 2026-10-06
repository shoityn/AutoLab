import { useCallback, useRef } from 'react'
import gsap from 'gsap'

/**
 * Tamanho do mundo. Casa com as cenas de public/salas/<n>/cena.webp e com
 * public/coordenadas.json, que estão todos em 1920 x 1080 (paisagem).
 * Ver DECISOES.md — mudou do 1000 x 1600 (retrato) descrito no PLANO.md v2.
 */
export const MUNDO = { largura: 1920, altura: 1080 }

/** Abaixo desta proporção (largura/altura) a tela é considerada retrato. */
export const PROPORCAO_MINIMA = 1.2

export function ehRetrato(largura = window.innerWidth, altura = window.innerHeight) {
  return largura / altura < PROPORCAO_MINIMA
}

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Zoom que faz a sala inteira caber na tela (contain). Sobra vira faixa de --bg. */
export function zoomVisaoGeral(vw, vh) {
  return Math.min(vw / MUNDO.largura, vh / MUNDO.altura)
}

/**
 * Impede a câmera de mostrar o vazio fora da sala: o centro é limitado para que
 * as bordas do mundo nunca entrem na tela quando o zoom é maior que o da visão
 * geral. Se o mundo couber inteiro no eixo, centraliza (aí a faixa é proposital).
 */
export function limitarCentro({ x, y, zoom }, vw, vh) {
  const metadeX = vw / 2 / zoom
  const metadeY = vh / 2 / zoom

  const px =
    metadeX * 2 >= MUNDO.largura ? MUNDO.largura / 2 : Math.min(Math.max(x, metadeX), MUNDO.largura - metadeX)
  const py = metadeY * 2 >= MUNDO.altura ? MUNDO.altura / 2 : Math.min(Math.max(y, metadeY), MUNDO.altura - metadeY)

  return { x: px, y: py, zoom }
}

/** Transform do mundo para "olhar" um ponto com um zoom. Ver PLANO.md seção 6.1. */
export function enquadrarEm(alvo, vw, vh) {
  const { x, y, zoom } = limitarCentro(alvo, vw, vh)
  return { x: vw / 2 - x * zoom, y: vh / 2 - y * zoom, scale: zoom }
}

/** Posição em tela (px) de um ponto do mundo, dada a câmera atual. Seção 6.5. */
export function pontoParaTela(ponto, camera, vw = window.innerWidth, vh = window.innerHeight) {
  const { x, y, zoom } = limitarCentro(camera, vw, vh)
  return {
    left: vw / 2 + (ponto.x - x) * zoom,
    top: vh / 2 + (ponto.y - y) * zoom,
  }
}

/** Câmera da visão geral: sala inteira, centralizada. */
export function cameraVisaoGeral(vw = window.innerWidth, vh = window.innerHeight) {
  return { x: MUNDO.largura / 2, y: MUNDO.altura / 2, zoom: zoomVisaoGeral(vw, vh) }
}

/**
 * Técnica de câmera 2.5D: o "mundo" (1920 x 1080) é posicionado dentro do
 * viewport por transform (x, y, scale). Ver PLANO.md seção 6.
 */
export function useCamera(viewportRef, mundoRef) {
  const alvoAtual = useRef(null)

  const tela = useCallback(() => {
    const el = viewportRef.current
    if (!el) return { width: window.innerWidth, height: window.innerHeight }
    const { width, height } = el.getBoundingClientRect()
    return { width: width || window.innerWidth, height: height || window.innerHeight }
  }, [viewportRef])

  const enquadrar = useCallback(
    (alvo) => {
      const { width, height } = tela()
      return enquadrarEm(alvo, width, height)
    },
    [tela],
  )

  const visaoGeral = useCallback(() => {
    const { width, height } = tela()
    return cameraVisaoGeral(width, height)
  }, [tela])

  /** Alvo efetivo da câmera (já limitado), para converter mundo -> tela. */
  const alvoEfetivo = useCallback(
    (alvo) => {
      const { width, height } = tela()
      return limitarCentro(alvo, width, height)
    },
    [tela],
  )

  // Move a câmera e aplica parallax nas camadas. Devolve a timeline.
  const ir = useCallback(
    (alvo, { duracao = 1.2, ease = 'power3.inOut', mundo, onComplete } = {}) => {
      const el = mundo ?? mundoRef.current
      if (!el) {
        onComplete?.()
        return gsap.timeline()
      }

      const d = prefereMovimentoReduzido() ? 0 : duracao
      alvoAtual.current = alvo

      const { width, height } = tela()
      const limitado = limitarCentro(alvo, width, height)
      const tl = gsap.timeline({ onComplete })
      tl.to(el, { ...enquadrarEm(alvo, width, height), duration: d, ease, overwrite: 'auto' }, 0)

      // Parallax: camadas com profundidade != 1 deslizam contra a câmera.
      el.querySelectorAll('[data-profundidade]').forEach((camada) => {
        const p = parseFloat(camada.dataset.profundidade)
        if (!p || p === 1) return
        tl.to(
          camada,
          {
            x: (limitado.x - MUNDO.largura / 2) * (1 - p),
            y: (limitado.y - MUNDO.altura / 2) * (1 - p),
            duration: d,
            ease,
            overwrite: 'auto',
          },
          0,
        )
      })

      return tl
    },
    [mundoRef, tela],
  )

  // Chamar no resize/orientationchange.
  const reenquadrar = useCallback(() => {
    if (alvoAtual.current && mundoRef.current) {
      gsap.set(mundoRef.current, enquadrar(alvoAtual.current))
    }
  }, [enquadrar, mundoRef])

  return { ir, enquadrar, visaoGeral, alvoEfetivo, reenquadrar, alvoAtual }
}
