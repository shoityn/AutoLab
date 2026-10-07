import CopiaRobo from './CopiaRobo'
import Mascote from './Mascote'
import BalaoFala from './BalaoFala'
import { MARCA } from '../lib/assets'

/**
 * HUD fixo e discreto: marca, nome da sala, contador de registros, avatar do
 * Zinos com expressão, miniatura da cópia e o menu. PLANO v2.1 seção 4.3.
 * A fala de entrada da sala aparece num balão sob o avatar.
 */
function Hud({
  ordem,
  titulo,
  lidosCount,
  totalCards,
  pecas,
  totalPecas,
  serie,
  expressao = 'neutro',
  fala,
  onDispensarFala,
  onRecomecar,
}) {
  return (
    <>
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-3 py-2"
        style={{
          paddingLeft: 'max(.75rem, env(safe-area-inset-left))',
          paddingRight: 'max(.75rem, env(safe-area-inset-right))',
          paddingTop: 'max(.5rem, env(safe-area-inset-top))',
          background: 'linear-gradient(to bottom, rgba(11,17,24,.78), rgba(11,17,24,0))',
        }}
      >
        <div className="flex items-center gap-2.5">
          <img src={MARCA.simboloMonoBranco} alt="AutoLab" className="h-7 w-7 opacity-85" draggable="false" />
          <div className="leading-tight text-white">
            <p className="text-[10px] uppercase tracking-[2px] opacity-70">Sala {ordem}</p>
            <p className="text-[13px] font-semibold">{titulo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end gap-1 text-white">
            <p className="text-[11px] tabular-nums opacity-85">
              Registros {lidosCount}/{totalCards}
            </p>
            <div className="flex gap-1" role="img" aria-label={`${lidosCount} de ${totalCards} registros lidos`}>
              {Array.from({ length: totalCards }, (_, i) => (
                <span
                  key={i}
                  className="block h-1.5 w-4 rounded-full transition-colors"
                  style={{ background: i < lidosCount ? 'var(--hotspot)' : 'rgba(255,255,255,.25)' }}
                />
              ))}
            </div>
          </div>

          <Mascote expressao={expressao} piscar className="w-11 shrink-0" />

          <CopiaRobo pecas={pecas} serie={serie} className="h-11 w-8" />

          <button
            type="button"
            onClick={onRecomecar}
            aria-label="Recomeçar turno do início"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M19 12a7 7 0 11-2.05-4.95M19 4v4h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <span className="sr-only" aria-live="polite">
          {pecas.length} de {totalPecas} peças da cópia {serie} montadas.
        </span>
      </header>

      {/* Fala de entrada da sala */}
      {fala && (
        <div
          className="pointer-events-none fixed left-0 z-20 px-3"
          style={{ top: 'calc(max(.5rem, env(safe-area-inset-top)) + 3.6rem)', paddingLeft: 'max(.75rem, env(safe-area-inset-left))' }}
        >
          <div className="pointer-events-auto">
            <BalaoFala texto={fala} expressao="explicando" compacto aoFechar={onDispensarFala} />
          </div>
        </div>
      )}
    </>
  )
}

export default Hud
