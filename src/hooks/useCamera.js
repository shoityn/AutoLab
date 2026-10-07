import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { MUNDO } from '../lib/conteudo'

export { MUNDO }

/** Abaixo desta proporção (largura/altura) a tela é considerada retrato. */
export const PROPORCAO_MINIMA = 1.2

/** Acima desta altura o painel de card/quiz abre centralizado em vez de lateral. */
export const ALTURA_PAINEL_LATERAL = 560

export function ehRetrato(largura = window.innerWidth, altura = window.innerHeight) {
  return largura / altura < PROPORCAO_MINIMA
}

export function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Zoom em que a parede inteira cabe na tela (contain). PLANO v2.1 seção 6.1. */
export function zoomBase(vw, vh) {
  return Math.min(vw / MUNDO.largura, vh / MUNDO.altura)
}

/** Câmera da visão geral: a parede inteira, centralizada. */
export function cameraVisaoGeral(vw = window.innerWidth, vh = window.innerHeight) {
  return { x: MUNDO.largura / 2, y: MUNDO.altura / 2, zoom: zoomBase(vw, vh) }
}

/**
 * Alvo de um hotspot ou da saída. `aproximacao` vem do JSON e é **multiplicador
 * da visão geral**, não zoom absoluto (foi a mudança da v2 para a v2.1: o valor
 * absoluto dava enquadramentos diferentes em cada tela).
 */
export function alvoDe(ponto, vw = window.innerWidth, vh = window.innerHeight) {
  return { x: ponto.x, y: ponto.y, zoom: zoomBase(vw, vh) * (ponto.aproximacao ?? 1) }
}

/**
 * Impede a câmera de mostrar o vazio fora da parede. `ancoraX`/`ancoraY` dizem
 * em que ponto da tela o alvo deve cair (0,5 = centro); com o painel lateral
 * aberto a âncora desloca para a metade livre da tela.
 */
export function limitarCentro({ x, y, zoom }, vw, vh, ancoraX = 0.5, ancoraY = 0.5) {
  const antes = (vw * ancoraX) / zoom
  const depois = (vw * (1 - ancoraX)) / zoom
  const acima = (vh * ancoraY) / zoom
  const abaixo = (vh * (1 - ancoraY)) / zoom

  const px = antes + depois >= MUNDO.largura ? MUNDO.largura / 2 : Math.min(Math.max(x, antes), MUNDO.largura - depois)
  const py = acima + abaixo >= MUNDO.altura ? MUNDO.altura / 2 : Math.min(Math.max(y, acima), MUNDO.altura - abaixo)

  return { x: px, y: py, zoom }
}

/** Transform do mundo para "olhar" um ponto. */
export function enquadrarEm(alvo, vw, vh, ancoraX = 0.5, ancoraY = 0.5) {
  const { x, y, zoom } = limitarCentro(alvo, vw, vh, ancoraX, ancoraY)
  return { x: vw * ancoraX - x * zoom, y: vh * ancoraY - y * zoom, scale: zoom }
}

/** Posição em tela (px) de um ponto do mundo, dada a câmera atual. Seção 6.4. */
export function pontoParaTela(ponto, camera, vw = window.innerWidth, vh = window.innerHeight, ancoraX = 0.5) {
  const { x, y, zoom } = limitarCentro(camera, vw, vh, ancoraX)
  return {
    left: vw * ancoraX + (ponto.x - x) * zoom,
    top: vh / 2 + (ponto.y - y) * zoom,
  }
}

/**
 * Câmera 2.5D: o "mundo" (1920 × 1080) é posicionado dentro do viewport por
 * transform (x, y, scale). PLANO v2.1 seção 6.
 */
export function useCamera(viewportRef, mundoRef) {
  const alvoAtual = useRef(null)
  const ancoraAtual = useRef(0.5)

  const tela = useCallback(() => {
    const el = viewportRef.current
    if (!el) return { width: window.innerWidth, height: window.innerHeight }
    const { width, height } = el.getBoundingClientRect()
    return { width: width || window.innerWidth, height: height || window.innerHeight }
  }, [viewportRef])

  const enquadrar = useCallback(
    (alvo, ancoraX = 0.5) => {
      const { width, height } = tela()
      return enquadrarEm(alvo, width, height, ancoraX)
    },
    [tela],
  )

  const visaoGeral = useCallback(() => {
    const { width, height } = tela()
    return cameraVisaoGeral(width, height)
  }, [tela])

  /** Converte um ponto do JSON (com `aproximacao`) no alvo da câmera. */
  const alvo = useCallback(
    (ponto) => {
      const { width, height } = tela()
      return alvoDe(ponto, width, height)
    },
    [tela],
  )

  // Move a câmera. Devolve a timeline (o chamador decide o onComplete).
  const ir = useCallback(
    (destino, { duracao = 1.2, ease = 'power3.inOut', mundo, ancoraX = 0.5, onComplete } = {}) => {
      const el = mundo ?? mundoRef.current
      if (!el) {
        onComplete?.()
        return gsap.timeline()
      }

      const d = prefereMovimentoReduzido() ? 0 : duracao
      alvoAtual.current = destino
      ancoraAtual.current = ancoraX

      const { width, height } = tela()
      return gsap.timeline({ onComplete }).to(el, {
        ...enquadrarEm(destino, width, height, ancoraX),
        duration: d,
        ease,
        overwrite: 'auto',
      })
    },
    [mundoRef, tela],
  )

  // Chamar no resize/orientationchange.
  const reenquadrar = useCallback(() => {
    if (alvoAtual.current && mundoRef.current) {
      gsap.set(mundoRef.current, enquadrar(alvoAtual.current, ancoraAtual.current))
    }
  }, [enquadrar, mundoRef])

  return { ir, enquadrar, visaoGeral, alvo, reenquadrar, alvoAtual, ancoraAtual }
}
