import Mascote from './Mascote'
import { ABERTURA } from '../lib/conteudo'

/**
 * Camada por cima de tudo quando o aparelho está em pé. Não bloqueia: quem
 * quiser joga assim mesmo, no modo contain (PLANO v2.1 seção 4.5).
 * A cabeça do Zinos e o ícone de celular giram juntos, em loop.
 */
function AvisoOrientacao({ onContinuar }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: 'var(--marca-tela)', color: 'var(--marca-creme)' }}
      role="dialog"
      aria-modal="false"
      aria-label={ABERTURA.orientacao.titulo}
    >
      <div className="girar-dica flex items-center gap-4">
        <Mascote expressao="indicando" className="w-28" titulo="Zinos pedindo para girar o celular" />
        <svg viewBox="0 0 48 72" className="h-16" aria-hidden="true">
          <rect
            x="4"
            y="2"
            width="40"
            height="68"
            rx="7"
            fill="none"
            stroke="var(--marca-creme)"
            strokeWidth="3"
            opacity=".75"
          />
          <rect x="10" y="10" width="28" height="48" rx="3" fill="var(--marca-ciano)" opacity=".25" />
          <circle cx="24" cy="64" r="2.5" fill="var(--marca-creme)" opacity=".75" />
        </svg>
      </div>

      <h1 className="max-w-xs text-lg font-bold" style={{ color: 'var(--marca-ciano)' }}>
        {ABERTURA.orientacao.titulo}
      </h1>

      <button
        type="button"
        onClick={onContinuar}
        className="min-h-11 rounded-xl border border-white/25 px-5 text-sm font-semibold active:scale-[.98]"
      >
        {ABERTURA.orientacao.continuar}
      </button>
    </div>
  )
}

export default AvisoOrientacao
