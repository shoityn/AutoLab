import { useCallback, useEffect, useState } from 'react'
import { ehRetrato } from './useCamera'

const CHAVE = 'autolab:orientacao-ignorada'

function leuEscolha() {
  try {
    return window.sessionStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

/**
 * O aviso de girar o celular é uma camada por cima, não um estado da máquina
 * (PLANO v2.1 seção 5). A escolha "continuar assim mesmo" vale só na sessão.
 */
export function useOrientacao() {
  const [retrato, setRetrato] = useState(() => ehRetrato())
  const [ignorado, setIgnorado] = useState(leuEscolha)

  useEffect(() => {
    const avaliar = () => setRetrato(ehRetrato())
    window.addEventListener('resize', avaliar)
    window.addEventListener('orientationchange', avaliar)
    return () => {
      window.removeEventListener('resize', avaliar)
      window.removeEventListener('orientationchange', avaliar)
    }
  }, [])

  const ignorar = useCallback(() => {
    setIgnorado(true)
    try {
      window.sessionStorage.setItem(CHAVE, '1')
    } catch {
      // sessionStorage indisponível — a escolha vale só enquanto a página viver
    }
  }, [])

  return { retrato, mostrarAviso: retrato && !ignorado, ignorar }
}

/**
 * Tenta tela cheia + travar em paisagem no Android. Falha em silêncio no iPhone
 * e no navegador interno do WhatsApp — isso é esperado, e o jogo segue.
 */
export async function tentarPaisagem() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
    }
  } catch {
    // sem tela cheia, segue normal
  }
  try {
    await window.screen?.orientation?.lock?.('landscape')
  } catch {
    // sem trava de orientação, segue normal
  }
}
