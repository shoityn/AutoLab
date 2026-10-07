import { useSom } from '../hooks/useSom'

/**
 * Liga/desliga do som. Aparece no HUD das salas e no painel da fachada.
 *
 * O jogo começa mudo de propósito: quem chega vem de um QR num cartaz, quase
 * sempre num corredor e sem fone. Ligar é escolha, e a escolha fica guardada.
 *
 * A sinalização não depende só de cor (PLANO.md seção 11): o ícone muda de
 * desenho, o `aria-label` diz a ação e o `aria-pressed` diz o estado.
 */
function BotaoSom({ className = '', variante = 'hud' }) {
  const { ligado, alternar } = useSom()

  const base =
    'pointer-events-auto flex items-center justify-center rounded-full border text-white active:scale-95 transition-colors'
  const estilo =
    variante === 'hud'
      ? 'h-11 w-11 border-white/25 bg-black/35 backdrop-blur-sm'
      : 'h-11 gap-2 border-white/25 bg-white/5 px-3 text-[12.5px] font-semibold'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={ligado}
      aria-label={ligado ? 'Desligar o som' : 'Ligar o som'}
      className={`${base} ${estilo} ${className}`}
      style={ligado ? { borderColor: 'var(--marca-ciano)', color: 'var(--marca-ciano)' } : undefined}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path
          d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {ligado ? (
          <path
            d="M15.5 9.2a4 4 0 010 5.6M18 6.8a7.5 7.5 0 010 10.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M16 9.5l5 5m0-5l-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
      {variante === 'fachada' && <span>{ligado ? 'Som ligado' : 'Ligar o som'}</span>}
    </button>
  )
}

export default BotaoSom
