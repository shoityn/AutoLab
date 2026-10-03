import Robo from './Robo'

/** HUD fixo e discreto: nome da sala, contador de registros, robô em miniatura e menu. Ver seção 4.1. */
function Hud({ titulo, lidosCount, totalCards, pecas, onRecomecar }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-black/40 px-4 py-2 text-white backdrop-blur-sm">
      <div className="pointer-events-none">
        <p className="text-xs font-semibold">{titulo}</p>
        <p className="text-[11px] opacity-80">
          Registros {lidosCount}/{totalCards}
        </p>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        <Robo pecas={pecas} className="h-10 w-10" />
        <button
          type="button"
          onClick={onRecomecar}
          aria-label="Recomeçar turno"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/30 text-sm"
        >
          ⟲
        </button>
      </div>
    </div>
  )
}

export default Hud
