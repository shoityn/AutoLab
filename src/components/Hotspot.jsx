import { forwardRef } from 'react'

/**
 * Botão do hotspot. Renderizado num overlay em tela, não dentro do mundo, para
 * manter sempre 44x44 px de área de toque, qualquer que seja o zoom da câmera
 * (PLANO.md seções 6.5 e 11).
 *
 * `estadoVisual`: 'novo' | 'lido' | 'trancado' | 'liberado' | 'saida'
 * A sinalização nunca depende só de cor: cada estado tem o seu ícone.
 */

function Icone({ nome }) {
  switch (nome) {
    case 'lido':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'trancado':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <rect x="5" y="10" width="14" height="10" rx="2.5" fill="currentColor" />
          <path d="M8 10V7.5a4 4 0 018 0V10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      )
    case 'saida':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 12h14m-5-6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'liberado':
      return (
        <span className="text-base font-bold leading-none" aria-hidden="true">
          ?
        </span>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="6.6" r="1.7" fill="currentColor" />
          <rect x="10.4" y="10" width="3.2" height="8.4" rx="1.6" fill="currentColor" />
        </svg>
      )
  }
}

const Hotspot = forwardRef(function Hotspot({ x, y, rotulo, estadoVisual, onClick, oculto = false }, ref) {
  const trancado = estadoVisual === 'trancado'
  const pulsa = estadoVisual === 'novo' || estadoVisual === 'liberado' || estadoVisual === 'saida'

  const cor = trancado
    ? 'rgba(255,255,255,.55)'
    : estadoVisual === 'lido'
      ? 'var(--acento)'
      : 'var(--hotspot)'

  const fundo = trancado
    ? 'rgba(11,17,24,.72)'
    : estadoVisual === 'lido'
      ? 'color-mix(in srgb, var(--marca-tela) 78%, transparent)'
      : 'color-mix(in srgb, var(--marca-tela) 70%, transparent)'

  const descricao = trancado
    ? `${rotulo} — trancado. Leia todos os registros desta sala primeiro.`
    : estadoVisual === 'lido'
      ? `${rotulo} — já lido. Abrir novamente.`
      : rotulo

  return (
    <button
      ref={ref}
      type="button"
      aria-label={descricao}
      onClick={onClick}
      tabIndex={oculto ? -1 : 0}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        opacity: oculto ? 0 : 1,
        pointerEvents: oculto ? 'none' : 'auto',
        transition: 'opacity .25s ease',
      }}
      className="group flex h-11 w-11 items-center justify-center rounded-full outline-offset-4 active:scale-95"
    >
      {pulsa && (
        <span
          aria-hidden="true"
          className="anel-pulso pointer-events-none absolute inset-0 rounded-full border-2"
          style={{ borderColor: cor }}
        />
      )}
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-[2px] transition-transform group-hover:scale-110"
        style={{ borderColor: cor, color: cor, background: fundo }}
      >
        <Icone nome={estadoVisual} />
      </span>
    </button>
  )
})

export default Hotspot
