import { MARCA } from '../lib/assets'
import { ZinosCabeca } from './Zinos'

/**
 * Overlay da Recepção, por cima da cena da fachada. O logotipo já aparece na
 * placa da fábrica, então aqui entra só a caixa de diálogo do Zinos e os botões.
 */
function Recepcao({ temProgresso, onIniciar, onContinuar, onRecomecar }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-end p-4"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className="pointer-events-auto w-full max-w-md rounded-2xl border p-3.5 shadow-2xl backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--marca-tela) 82%, transparent)',
          borderColor: 'color-mix(in srgb, var(--marca-ciano) 35%, transparent)',
        }}
      >
        <div className="flex items-start gap-3">
          <ZinosCabeca expressao="feliz" className="h-12 w-15 shrink-0" titulo="Zinos, o guia da fábrica" />

          <div className="min-w-0 flex-1">
            <img src={MARCA.horizontalMonoBranco} alt="AutoLab" className="mb-1.5 h-4" draggable="false" />
            <h1 className="sr-only">AutoLab</h1>
            <p className="text-[12.5px] leading-snug text-white/90">
              Oi! Eu sou o <strong className="font-semibold text-[var(--marca-ciano)]">Zinos</strong>, e hoje você é o
              operador da AutoLab — a fábrica onde um modelo de inteligência artificial é construído do zero. Explore
              cada sala, toque nos pontos que estiverem piscando, responda ao registro final e monte uma cópia minha
              até a expedição.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {temProgresso ? (
            <>
              <button
                type="button"
                onClick={onContinuar}
                className="min-h-11 flex-1 rounded-xl px-5 font-semibold active:scale-[.98]"
                style={{ background: 'var(--marca-ciano)', color: 'var(--marca-tela)' }}
              >
                Continuar o turno
              </button>
              <button
                type="button"
                onClick={onRecomecar}
                className="min-h-11 rounded-xl border border-white/25 px-5 font-semibold text-white active:scale-[.98]"
              >
                Recomeçar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onIniciar}
              className="min-h-11 w-full rounded-xl px-6 font-semibold active:scale-[.98] sm:w-auto"
              style={{ background: 'var(--marca-ciano)', color: 'var(--marca-tela)' }}
            >
              Iniciar turno
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recepcao
