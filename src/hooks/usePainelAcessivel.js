import { useEffect } from 'react'

/**
 * Foco no painel ao abrir, Esc fecha, foco volta pro elemento anterior ao fechar.
 * Ver PLANO.md seção 11.
 */
export function usePainelAcessivel(ref, aoFechar) {
  useEffect(() => {
    const anterior = document.activeElement
    const alvoFoco = ref.current?.querySelector('[data-foco-inicial]')
    alvoFoco?.focus()

    function aoTeclar(evento) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      if (anterior instanceof HTMLElement) anterior.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
