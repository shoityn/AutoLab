import { useEffect } from 'react'

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Acessibilidade dos painéis (PLANO.md seção 11):
 * - o foco vai para o título ao abrir;
 * - o Tab fica preso dentro do painel enquanto ele estiver aberto;
 * - Esc fecha;
 * - ao fechar, o foco volta para o elemento que estava focado antes.
 */
export function usePainelAcessivel(ref, aoFechar) {
  useEffect(() => {
    const anterior = document.activeElement
    const painel = ref.current

    painel?.querySelector('[data-foco-inicial]')?.focus()

    function aoTeclar(evento) {
      if (evento.key === 'Escape') {
        evento.stopPropagation()
        aoFechar()
        return
      }

      if (evento.key !== 'Tab' || !painel) return

      const focaveis = Array.from(painel.querySelectorAll(FOCAVEIS)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (focaveis.length === 0) {
        evento.preventDefault()
        return
      }

      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      const atual = document.activeElement

      // Fora do painel (ex.: foco no título, que tem tabindex -1): puxa de volta.
      if (!painel.contains(atual)) {
        evento.preventDefault()
        ;(evento.shiftKey ? ultimo : primeiro).focus()
        return
      }

      if (evento.shiftKey && atual === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && atual === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      if (anterior instanceof HTMLElement && document.contains(anterior)) anterior.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
