import { MARCA, ZINOS_CORPO } from '../lib/assets'

/**
 * As cenas são ilustradas em 1920x1080 (paisagem), então em retrato a sala
 * ficaria numa faixa fina demais para caber os hotspots sem sobreposição.
 * Esta tela pede para girar o aparelho — mas não bloqueia: quem insistir joga
 * assim mesmo, com a sala encaixada na largura. Ver DECISOES.md.
 */
function GirarCelular({ onJogarAssimMesmo }) {
  return (
    <main
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: 'var(--marca-tela)', color: 'var(--marca-creme)' }}
    >
      <img src={MARCA.horizontalMonoBranco} alt="AutoLab" className="h-6 opacity-90" draggable="false" />

      <img
        src={ZINOS_CORPO.neutro}
        alt=""
        aria-hidden="true"
        className="girar-dica h-36 select-none"
        draggable="false"
      />

      <div className="max-w-xs space-y-2">
        <h1 className="text-lg font-bold" style={{ color: 'var(--marca-ciano)' }}>
          Gire o celular
        </h1>
        <p className="text-sm opacity-80">
          As salas da fábrica são largas. Deitando o aparelho você vê a sala inteira de uma vez.
        </p>
      </div>

      <button
        type="button"
        onClick={onJogarAssimMesmo}
        className="min-h-11 rounded-xl border border-white/25 px-5 text-sm font-semibold active:scale-[.98]"
      >
        Jogar assim mesmo
      </button>
    </main>
  )
}

export default GirarCelular
